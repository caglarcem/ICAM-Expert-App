import * as fs from 'fs';
import { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import { convertHandwrittenPdfToTextByAzure } from '../services/pdfToText.service';
import { queryMultipleDocumentsWithSingleAnswer } from '../services/queryDocuments.service';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';
import { config } from '../../appConfig';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

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

export { saveFiles, getQueryAnswer };

// const mockAnswer = `MOCK Response: Sure, here is a draft PEEPO table for the given incident, including some additional potential items that may be required for a thorough ICAM investigation: ### **PEEPO Item** --- **Description** *** People --- 1. Nathan Cross, Driller, 10 years in role, 6 months in company, 18 years in industry. Directly involved, first responder. 2. Richard Heritage, received the report, Exploration Supervisor. 3. Tim Brown, supervisor notified. 4. Daniel, offsider, injured party. *** Environment --- 1. Clear, warm day. 2. Operating conditions were favorable (no dust, darkness, or rough conditions mentioned). *** Equipment --- 1. Drill rig (Asset ID: 1271). 2. Table inserts. 3. Emergency stops (E stops). 4. First-aid supplies used (clean rag). *** Processes --- 1. Lowering rods into the hole with the head. 2. Dropping the table inserts into place. 3. Emergency stop procedures engaged. *** Organization --- 1. Communication protocols: Incident was promptly reported to the supervisor. 2. Emergency response procedures: First aid administered, ambulance called and arrived. 3. Safety training and awareness: Investigation on whether adequate training was provided. 4. Reporting lines: Clear responsibilities as per hierarchy. *** ### **Additional Potential PEEPO Items** --- **Description** *** People --- 1. Investigation into any other team members who might have knowledge or insights about previous incidents or near-misses. 2. Include medical personnel who attended to the injury. 3. Review fatigue and personal factors in-depth for all involved parties. *** Environment --- 1. Examine lighting conditions, even if daytime, to ensure visibility was optimal at the incident site. 2. Check for any potential distractions in the environment. *** Equipment --- 1. Inspect table inserts for any defects or issues that could have contributed. 2. Review maintenance records of the drill rig and inserts. *** Processes --- 1. Step-by-step documentation of the rod lowering process. 2. Review emergency protocols and the timeline of the response. 3. Assess whether the offsider's actions were in line with expected procedures. *** Organization --- 1. A comprehensive review of team communication before and during the task. 2. Assess organization's safety culture and previous incident records. 3. Evaluate if there were any deviations from standard operating procedures.`;
// const mockAnswer2 = `### Draft PEEPO for the Incident: **P**eople: - Nathan Cross (driller, directly involved) *** - Daniel Fischer (offsider, injured) *** - Tim Brown (event reported to) *** - Richard Heritage (exploration supervisor, reported to) *** - Second offsider (unnamed, involved in response) *** - Brendon Balmain (notified by Richard Heritage) *** - Medics and ambulance personnel *** ### **E**nviroment: - Clear and warm day *** - Incident occurred on the rig table *** - Time of Incident: 16:45 *** - Weather conditions not influencing the incident as per reports *** ### **E**quipment: - Asset ID: 1271 *** - Rods and table inserts used in the drilling process *** - Emergency stops (E stops) engaged *** - Ute used to transport Daniel to medics *** ### **P**rocedures: - Procedure for lowering rods with head *** - Use of table inserts *** - Emergency procedures engaged after injury: E stop, wrapping the injury, transportation to medics, and notification of supervisors *** - Reporting and documentation procedures *** ### **O**rganization: - Reporting structure: Incident reported to supervisor, then to company officials *** - Communication protocols observed: Notifications made to required personnel in timely manner *** - Medical evacuation protocols followed *** - Incident debrief completed by personnel involved *** ### Additional PEEPO Items to Investigate: - Training protocols for handling table inserts and emergencies *** - Compliance with job safety analysis and risk assessments *** - Equipment maintenance records (specifically for Rods, table inserts, and E stops) *** - Fatigue management and rostering (specific data on how many days into the swing) *** - Review of radio and MineStar records for comprehensive capture of events *** - Personal protective equipment (PPE) usage and its effectiveness during the incident *** ###`;
// 1. Interviewtools
const mockAnswer = `<b>Analysis of Discrepancies</b></n>
<b>1. Timing discrepancy</b></n>
* Incident reported to supervisor at 16:46 by Nathan Cross</n> 
* Tim Brown notified Stanmore supervisors at approximately 16:58</n>
<b>2. Roles and involvement discrepancy</b></n>
* Nathan Cross mentioned being the first responder who also took Daniel to the medics</n>
* Richard Heritage mentioned receiving a call from Tim Brown and meeting Nathan and the crew at the paramedic</n>
<b>3. Communication discrepancy</b></n>
* Nathan Cross engaged 'E stops' and communicated with the second offsider for preparing the ute</n>
* Richard Heritage did not mention the engagement of 'E stops' or communications with the second offsider</n>
<b>4. Incident description discrepancy</b></n>
* Nathan Cross described the offsider adjusting the insert and getting his finger caught</n>
* Richard Heritage did not describe the exact moment of injury but stated the incident as a degloved fingertip</n>
<b>Suggested Additional Interview Questions</b></n>
<b>Nathan Cross (Driller):</b></n>
1. Can you clarify the exact time of the incident and the sequence in which you notified Tim Brown?</n>
2. Did you encounter any difficulties when engaging the 'E stops' and preparing the ute?</n>
3. Can you explain the communication with the second offsider during and after the incident?</n>
<b>Richard Heritage (Exploration Supervisor):</b></n>
1. What were the exact details Tim Brown communicated to you regarding the incident and Nathan Cross’s actions?</n>
2. Can you describe what you observed when you reached the paramedic station?</n>
3. Was there any communication with Nathan Cross or the second offsider after you arrived at the paramedics?</n>
4. Can you give more details about how the ambulance service was involved and the timelines?</n>
### { "Nathan Cross": { "Questions": [ "Can you clarify the exact time of the incident and the sequence in which you notified Tim Brown?", "Did you encounter any difficulties when engaging the 'E stops' and preparing the ute?", "Can you explain the communication with the second offsider during and after the incident?" ] }, "Richard Heritage": { "Questions": [ "What were the exact details Tim Brown communicated to you regarding the incident and Nathan Cross’s actions?", "Can you describe what you observed when you reached the paramedic station?", "Was there any communication with Nathan Cross or the second offsider after you arrived at the paramedics?", "Can you give more details about how the ambulance service was involved and the timelines?" ] } }
[
  {
    "Name": "Nathan Cross",
    "Questions": [
      "How long were you waiting before you went to the medics?",
      "What was the exact communication between you and the offsider Daniel before the incident?",
      "Can you describe what you were looking at when you briefly looked away?"
    ]
  },
  {
    "Name": "Richard Heritage",
    "Questions": [
      "Can you clarify the exact time sequence from when you were notified by Tim Brown until you met with the drill crew?",
      "What specific steps did you take after receiving the call about the incident?",
      "How often do you check on the crew's status when you are working on office tasks?",
      "Were there any changes to the work procedure after the incident that you noticed?"
    ]
  }
]`;
