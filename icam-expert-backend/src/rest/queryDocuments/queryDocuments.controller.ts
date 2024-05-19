import * as fs from 'fs';
import { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import path, { parse } from 'path';
import { convertHandwrittenPdfToTextByAzure } from '../services/pdfToText.service';
import { queryMultipleDocumentsWithSingleAnswer } from '../services/queryDocuments.service';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';

// TODO add to configuration as it's also used while converting to text
const docFolder = 'uploads';

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
  console.log('Entered get query answer');

  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No file uploaded.');
  }

  // Uploaded succussfully

  // Question / query from the client
  const prompt = req.query.prompt as string;

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

  if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
    const answer = await queryMultipleDocumentsWithSingleAnswer(documents, prompt);

    if (!answer) return res.send('An error occured, please try again later.');

    res.send(answer);
  } else {
    // Dev / Test - Mock
    console.log('PROMPT: ', prompt);

    res.send(mockAnswer);
  }
};

export { saveFiles, getQueryAnswer };

const mockAnswer = `MOCK Response: After reviewing the documents, I have identified the following discrepancies between the reports of 
										the events: 1. **Role of Richard Heritage:** In the report by Josh Will, Richard Heritage is identified as a Driller's 
										Assistant, while in Nathan Cross's report, Richard Heritage is identified as a Driller. This discrepancy could affect the 
										understanding of the event and the responsibilities of individuals involved. 2. **Time of the Incident:** There is a 
										discrepancy in the reported time of the incident. In Josh Will's report, the incident is reported to have occurred at
										4:45 pm, while in Nathan Cross's report, the incident is reported to have occurred at 4:45 am. This inconsistency could 
										lead to confusion regarding the timeline of events. 3. **Location of the Incident:** In Josh Will's report, the exact location
										of the event is mentioned as "Romp 30 matural creo," while in Nathan Cross's report, the location is described as "Rig table." 
										Clarification on the exact location of the incident is essential for understanding the context of the event. 4. **Description 
										of the Task:** The descriptions of the tasks being carried out at the time of the event differ between the reports. Josh Will's 
										report mentions setting up to begin drilling, while Nathan Cross's report describes lowering a rod down a hole. Understanding the 
										specific tasks being undertaken is crucial for assessing any potential risks or hazards. 5. **Injuries:** Both reports involve an 
										injured offsider, but the nature of the injury is described differently. Josh Will's report talks about preparing a clean rag for 
										the injured offsider to hold over his finger, while Nathan Cross's report mentions the finger getting caught during a task. 
										Clarifying the exact details of the injury is important for understanding the severity and implications. 6. **Reporting 
										Process:** The individuals to whom the events were reported differ between the reports. In Josh Will's report, the 
										event was reported to Tim Brown, while in Nathan Cross's report, Tim Brown was also involved but reported to a 
										different supervisor. Consistency in reporting processes is crucial for effective communication and incident management. 
										These discrepancies highlight the importance of clear and accurate reporting in incidents to ensure that all details 
										are correctly documented and understood for appropriate follow-up actions and preventative measures. Clarifying these 
										discrepancies through further investigation and communication is essential for maintaining safety and compliance in open cut coal mining operations.`;
