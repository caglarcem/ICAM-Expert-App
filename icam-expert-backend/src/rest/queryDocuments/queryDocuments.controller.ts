import * as fs from 'fs';
import { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import { convertHandwrittenPdfToTextByAzure } from '../services/pdfToText.service';
import { queryMultipleDocumentsWithSingleAnswer } from '../services/queryDocuments.service';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';
import { config } from '../../appConfig';

const docFolder = config.appSettings.uploadFolder;

if (!fs.existsSync(docFolder)) {
  fs.mkdirSync(docFolder);
}

const saveFiles = (req: Request, res: Response, next: () => void) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, docFolder);
    },
    filename: function (req, file, cb) {
      if (fs.existsSync(path.join(docFolder, file.originalname))) {
        // File exists. Add the suffix (1) to the filename and save the new one.
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
      // A multer error occurred (e.g., file size limit exceeded)
      return res.status(400).send('File upload error: ' + err.message);
    } else if (err) {
      // An unknown error occurred
      return res.status(500).send('Internal server error.');
    }
    next();
  });
};

const getQueryAnswer = async (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No file uploaded.');
  }

  // Uploaded succussfully

  // Tool name from the client
  const toolName = req.query.tool as string;

  // Convert the handwritten pdf files to text files
  const documents: string[] = [];

  for (const file of req.files as Express.Multer.File[]) {
    const levelsUp = path.resolve(__dirname, '..', '..', '..');
    const pdfFilePath = path.join(levelsUp, docFolder, file.filename);

    try {
      const outputText = await convertHandwrittenPdfToTextByAzure(pdfFilePath);

      if (outputText) {
        documents.push(outputText);
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }

  if ([NodeEnvs.Production.valueOf(), NodeEnvs.ProductionLocal.valueOf()].includes(EnvVars.NodeEnv)) {
    const answer = await queryMultipleDocumentsWithSingleAnswer(documents, toolName);

    if (!answer) return res.send('An error occured, please try again later.');

    res.send(answer);
  } else {
    // Dev / Test - Mock
    res.send(mockAnswer2);
  }
};

export { saveFiles, getQueryAnswer };

const mockAnswer = `MOCK Response: Sure, here is a draft PEEPO table for the given incident, including some additional potential items that may be required for a thorough ICAM investigation: ### **PEEPO Item** --- **Description** *** People --- 1. Nathan Cross, Driller, 10 years in role, 6 months in company, 18 years in industry. Directly involved, first responder. 2. Richard Heritage, received the report, Exploration Supervisor. 3. Tim Brown, supervisor notified. 4. Daniel, offsider, injured party. *** Environment --- 1. Clear, warm day. 2. Operating conditions were favorable (no dust, darkness, or rough conditions mentioned). *** Equipment --- 1. Drill rig (Asset ID: 1271). 2. Table inserts. 3. Emergency stops (E stops). 4. First-aid supplies used (clean rag). *** Processes --- 1. Lowering rods into the hole with the head. 2. Dropping the table inserts into place. 3. Emergency stop procedures engaged. *** Organization --- 1. Communication protocols: Incident was promptly reported to the supervisor. 2. Emergency response procedures: First aid administered, ambulance called and arrived. 3. Safety training and awareness: Investigation on whether adequate training was provided. 4. Reporting lines: Clear responsibilities as per hierarchy. *** ### **Additional Potential PEEPO Items** --- **Description** *** People --- 1. Investigation into any other team members who might have knowledge or insights about previous incidents or near-misses. 2. Include medical personnel who attended to the injury. 3. Review fatigue and personal factors in-depth for all involved parties. *** Environment --- 1. Examine lighting conditions, even if daytime, to ensure visibility was optimal at the incident site. 2. Check for any potential distractions in the environment. *** Equipment --- 1. Inspect table inserts for any defects or issues that could have contributed. 2. Review maintenance records of the drill rig and inserts. *** Processes --- 1. Step-by-step documentation of the rod lowering process. 2. Review emergency protocols and the timeline of the response. 3. Assess whether the offsider's actions were in line with expected procedures. *** Organization --- 1. A comprehensive review of team communication before and during the task. 2. Assess organization's safety culture and previous incident records. 3. Evaluate if there were any deviations from standard operating procedures.`;
const mockAnswer2 = `### Draft PEEPO for the Incident: **P**eople: - Nathan Cross (driller, directly involved) *** - Daniel Fischer (offsider, injured) *** - Tim Brown (event reported to) *** - Richard Heritage (exploration supervisor, reported to) *** - Second offsider (unnamed, involved in response) *** - Brendon Balmain (notified by Richard Heritage) *** - Medics and ambulance personnel *** ### **E**nviroment: - Clear and warm day *** - Incident occurred on the rig table *** - Time of Incident: 16:45 *** - Weather conditions not influencing the incident as per reports *** ### **E**quipment: - Asset ID: 1271 *** - Rods and table inserts used in the drilling process *** - Emergency stops (E stops) engaged *** - Ute used to transport Daniel to medics *** ### **P**rocedures: - Procedure for lowering rods with head *** - Use of table inserts *** - Emergency procedures engaged after injury: E stop, wrapping the injury, transportation to medics, and notification of supervisors *** - Reporting and documentation procedures *** ### **O**rganization: - Reporting structure: Incident reported to supervisor, then to company officials *** - Communication protocols observed: Notifications made to required personnel in timely manner *** - Medical evacuation protocols followed *** - Incident debrief completed by personnel involved *** ### Additional PEEPO Items to Investigate: - Training protocols for handling table inserts and emergencies *** - Compliance with job safety analysis and risk assessments *** - Equipment maintenance records (specifically for Rods, table inserts, and E stops) *** - Fatigue management and rostering (specific data on how many days into the swing) *** - Review of radio and MineStar records for comprehensive capture of events *** - Personal protective equipment (PPE) usage and its effectiveness during the incident *** ###`;
