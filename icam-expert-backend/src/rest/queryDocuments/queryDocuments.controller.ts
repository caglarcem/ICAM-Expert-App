import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';
import { Request, Response } from 'express';
import * as fs from 'fs';
import multer, { Multer } from 'multer';
import path from 'path';
import { config } from '../../appConfig';
import { convertHandwrittenPdfToTextByAzure } from '../services/pdfToText.service';
import { queryMultipleDocumentsWithSingleAnswer } from '../services/queryDocuments.service';

const docFolder = config.appSettings.uploadFolder;

console.log('checking if uploads folder exists');
if (!fs.existsSync(docFolder)) {
  console.log('Uploads folder does not exist, creating...');
  fs.mkdirSync(docFolder);
}

const saveFiles = (req: Request, res: Response, next: () => void) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, docFolder);
    },
    filename: function (req, file, cb) {
      console.log('Checking if the file itself exists...');

      if (fs.existsSync(path.join(docFolder, file.originalname))) {
        // File exists. Add the suffix (1) to the filename and save the new one.
        console.log('File exists. Adding an additional suffix and creating the new file...');
        const parsedFile = path.parse(file.originalname);
        cb(null, `${parsedFile.name}(1)${parsedFile.ext}`);
      } else {
        cb(null, file.originalname);
      }
    },
  });

  const upload: Multer = multer({ storage });

  upload.array('files')(req, res, err => {
    if (err instanceof multer.MulterError) {
      console.log('Multer error: ', err.message);
      // A multer error occurred (e.g., file size limit exceeded)
      return res.status(400).send('File upload error: ' + err.message);
    } else if (err) {
      console.log('Upload error: ', err.message);
      // An unknown error occurred
      return res.status(500).send('Internal server error.');
    }
    next();
  });
};

const getQueryAnswer = async (req: Request, res: Response) => {
  console.log('Getting the query answer based on files');
  if (!req.files || req.files.length === 0) {
    console.log('No files found.');
    return res.status(400).send('No file uploaded.');
  }

  // Uploaded succussfully

  console.log('Upload successful.');

  // Tool name from the client
  const toolName = req.query.tool as string;

  // Convert the handwritten pdf files to text files
  const documents: string[] = [];

  console.log('Tool name:', toolName);

  for (const file of req.files as Express.Multer.File[]) {
    const levelsUp = path.resolve(__dirname, '..', '..', '..');
    const pdfFilePath = path.join(levelsUp, docFolder, file.filename);

    try {
      console.log('PDF file path:', pdfFilePath);

      const outputText = await convertHandwrittenPdfToTextByAzure(pdfFilePath);

      console.log('PDF converted to text');

      if (outputText) {
        console.log('The converted output text has some content');

        documents.push(outputText);
      }
    } catch (error) {
      console.log('Error processing file:', error);
    }
  }

  if ([NodeEnvs.Production.valueOf(), NodeEnvs.ProductionLocal.valueOf()].includes(EnvVars.NodeEnv)) {
    console.log('Production mode... Querying all the documents...');

    const answer = await queryMultipleDocumentsWithSingleAnswer(documents, toolName);

    if (!answer) {
      console.log('No answer...');

      return res.send('An error occured, please try again later.');
    }
    console.log('There is an answer.');

    res.send(answer);
  } else {
    // Dev / Test - Mock
    res.send(mockAnswer);
  }
};

export { getQueryAnswer, saveFiles };

// 1. Interview
// const mockAnswer = `<b>Analysis of Discrepancies</b></n>
// <b>1. Timing discrepancy</b></n>
// * Incident reported to supervisor at 16:46 by Nathan Cross</n>
// * Tim Brown notified Stanmore supervisors at approximately 16:58</n>
// <b>2. Roles and involvement discrepancy</b></n>
// * Nathan Cross mentioned being the first responder who also took Daniel to the medics</n>
// * Richard Heritage mentioned receiving a call from Tim Brown and meeting Nathan and the crew at the paramedic</n>
// <b>3. Communication discrepancy</b></n>
// * Nathan Cross engaged 'E stops' and communicated with the second offsider for preparing the ute</n>
// * Richard Heritage did not mention the engagement of 'E stops' or communications with the second offsider</n>
// <b>4. Incident description discrepancy</b></n>
// * Nathan Cross described the offsider adjusting the insert and getting his finger caught</n>
// * Richard Heritage did not describe the exact moment of injury but stated the incident as a degloved fingertip</n>
// <b>Suggested Additional Interview Questions</b></n>
// <b>Nathan Cross (Driller):</b></n>
// 1. Can you clarify the exact time of the incident and the sequence in which you notified Tim Brown?</n>
// 2. Did you encounter any difficulties when engaging the 'E stops' and preparing the ute?</n>
// 3. Can you explain the communication with the second offsider during and after the incident?</n>
// <b>Richard Heritage (Exploration Supervisor):</b></n>
// 1. What were the exact details Tim Brown communicated to you regarding the incident and Nathan Cross’s actions?</n>
// 2. Can you describe what you observed when you reached the paramedic station?</n>
// 3. Was there any communication with Nathan Cross or the second offsider after you arrived at the paramedics?</n>
// 4. Can you give more details about how the ambulance service was involved and the timelines?</n>
// ###
// [
//   {
//     "Name": "Nathan Cross",
//     "Questions": [
//       "How long were you waiting before you went to the medics?",
//       "What was the exact communication between you and the offsider Daniel before the incident?",
//       "Can you describe what you were looking at when you briefly looked away?"
//     ]
//   },
//   {
//     "Name": "Richard Heritage",
//     "Questions": [
//       "Can you clarify the exact time sequence from when you were notified by Tim Brown until you met with the drill crew?",
//       "What specific steps did you take after receiving the call about the incident?",
//       "Were there any changes to the work procedure after the incident that you noticed?"
//     ]
//   }
// ]`;

// PEEPO
// const mockAnswer =
//   '```json\n[\n    {\n        "Category": "People",\n        "Details": "Richard (Exploration Supervisor), Daniel Fischer (Injured Person), Tim Brown (Caller to Richard), Nathan Cross (Transported Injured Person), Brendon Balmain (Notified Supervisor)",\n        "Other": "Richard was in the office during the incident, Tim Brown informed Richard about the injury, Nathan Cross took Daniel to the paramedic",\n        "RelevantData": "Detailed statements from Daniel Fischer, Tim Brown, Nathan Cross, and Brendon Balmain"\n    },\n    {\n        "Category": "Environment",\n        "Details": "No specific environmental factors mentioned",\n        "Other": "Incident occurred late afternoon",\n        "RelevantData": "Specific time-related influences, workspace conditions around drilling site"\n    },\n    {\n        "Category": "Equipment",\n        "Details": "No specific equipment issues reported",\n        "Other": "Potential equipment malfunction not mentioned",\n        "RelevantData": "Details about equipment used by Daniel Fischer at the time of injury"\n    },\n    {\n        "Category": "Procedures",\n        "Details": "Notification procedure followed by Richard, transport of injured person to paramedic",\n        "Other": "Procedure to notify supervisors followed",\n        "RelevantData": "Specific procedures followed by Daniel Fischer and drill crew at time of incident"\n    },\n    {\n        "Category": "Organization",\n        "Details": "Richard reported incident to Brendan Balmain, waiting for ambulance",\n        "Other": "State of on-site first response protocols",\n        "RelevantData": "Communication effectiveness between exploration teams, efficiency of emergency response plan"\n    }\n]\n```';

// ROOT CAUSE ANALYSIS
const mockAnswer = `<b>1. Lack of attention and situational awareness</b></n> • <b>Summary:</b> The driller briefly looked away from the immediate task to check on another offsider, leading to a lapse in monitoring the active task.</n> • <b>Explanation:</b></n> ###[ { 'Contributing Factor': 'Driller briefly looked away while lowering rods', 'Certainty Rating': '90%', 'Explanation': 'The driller’s momentary lapse in attention compromised the safe execution of the task.' }, { 'Contributing Factor': 'Offsider adjusting insert without communicating', 'Certainty Rating': '80%', 'Explanation': 'The lack of communication between the driller and the offsider regarding the adjustment of the insert led to the incident.' }, { 'Contributing Factor': 'Complexity of task requiring full attention', 'Certainty Rating': '75%', 'Explanation': 'The task of lowering rods into the hole while simultaneously managing inserts is complex and requires undivided attention to avoid accidents.' } ] ### <b>2. Insufficient procedural safeguards</b></n> • <b>Summary:</b> There was a lack of adequate procedural safeguards in place to manage the risks associated with adjusting inserts during rod lowering.</n> • <b>Explanation:</b></n> ###[ { 'Contributing Factor': 'No clear procedure for adjusting inserts during active rod lowering', 'Certainty Rating': '85%', 'Explanation': 'The absence of a standardized procedure for safely adjusting inserts during rod lowering increased the likelihood of an incident.' }, { 'Contributing Factor': 'Inadequate training on risk management', 'Certainty Rating': '70%', 'Explanation': 'The crew may have lacked sufficient training on mitigating risks during multi-step processes like rod lowering and insert adjustments.' }, { 'Contributing Factor': 'Lack of communication protocols', 'Certainty Rating': '75%', 'Explanation': 'Insufficient communication protocols for high-risk tasks like these heightened the risk of accidents and injuries.' } ] ###`;
