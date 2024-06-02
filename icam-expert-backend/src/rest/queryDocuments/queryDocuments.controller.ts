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
    res.send(mockAnswer);
  }
};

export { saveFiles, getQueryAnswer };

const mockAnswer = `Certainly! PEEPO stands for People, Environment, Equipment, Procedures, and Organisation. From the provided data, here's a draft PEEPO analysis: ### PEEPO Analysis | Category | Description | Potential Items to Investigate | |--------------|----------------------------------------------------------------------------------------------|------------------------------------------------------------------| | People | - Injured Offsider: Daniel Fischer <br> - Driller <br> - Nathan Cross <br> - Richard Heritage (Exploration Supervisor) <br> - Tim Brown (reported to) | - Experience and training of involved personnel <br> - Fitness and fatigue levels <br> - Communication effectiveness | | Environment | - Location: Romp 30, natural area <br> - Conditions: Wind gusts, some dust, hot and dry temperature | - Weather conditions and their impact <br> - Visibility and dust control measures | | Equipment | - Rig truck <br> - Support track <br> - 2" water hose <br> - Fuel hose/pump <br> - PVC pre collar and diverter | - Condition and maintenance of the equipment <br> - Suitability of equipment for the task <br> - Safety features of the equipment | | Procedures | - Task: Inserting table slips, moving support track, connecting water hose, refueling | - Adherence to standard procedures <br> - Effectiveness of current procedures <br> - Adequacy of risk assessments | | Organisation | - Stanmore (Client) <br> - Poitrol (Site) <br> - ERT (Emergency Response Team) | - Emergency response protocols <br> - Communication and reporting structures <br> - Overall safety culture and management oversight | ### Additional PEEPO Items for Investigation | Category | Additional Items to Investigate | |---------------|----------------------------------------------------------------------------------------------------------------------------------| | People | - Psychological stress factors <br> - First aid response by Nathan Cross and driller <br> - Examination of shift patterns | | Environment | - Lighting condition at the exact time of the incident <br> - Area hazards like uneven ground, noise levels | | Equipment | - Detailed inspection records of rig truck and related equipment <br> - History of equipment failures or incidents | | Procedures | - Training records for handling the specific tasks <br> - Review of incident response procedures followed after the incident | | Organisation | - Communication protocols during shift operations <br> - Review of previous incident reports and corrective actions implemented | This draft PEEPO provides a comprehensive overview of the aspects related to the incident and highlights the areas that may require further investigation. You can copy this table into Excel and customize it as necessary to include any additional details discovered during the investigation.`;
