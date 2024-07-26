import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import multer, { Multer } from 'multer';
import path from 'path';
import { config } from '../../appConfig';
import { convertHandwrittenFileToTextByAzure } from '../services/pdfToText.service';
import { queryMultipleDocumentsWithSingleAnswer } from '../services/queryDocuments.service';
import { convertSpeechToText } from '../services/speechToText.service';
import convertVideoToAudio from '../services/videoToAudio.service';
import convertWordDocToText from '../services/wordToText.service';
import { QueryParameters } from '../types/types';
import { mockAnswer } from './mock.response.queryDocuments';

const viewerFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.tiff'];
const audioFileTypes = ['.wav', '.ogg', '.mp3', '.flac', '.amr'];
const videoFileTypes = ['.mp4', '.avi', '.mkv', '.mov', '.flv', '.wmv', '.webm', '.mpeg', '.mpg', '.3gp', '.ogv'];

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

      // TODO: #43 Reuse file -  always use the same filename (assumed the same file for now)
      // if (fs.existsSync(path.join(docFolder, file.originalname))) {
      //// File exists. Add the suffix (1) to the filename and save the new one.

      //// TODO as part of #43, compare with the existing file and: save as new file (1) if different.

      // console.log('File exists. Adding an additional suffix and creating the new file...');
      // const parsedFile = path.parse(file.originalname);
      // cb(null, `${parsedFile.name}(1)${parsedFile.ext}`);
      // } else {
      cb(null, file.originalname);
      // }
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

  // Uploaded successfully

  console.log('Upload successful.');

  // Tool name from the client
  const query: QueryParameters = {
    toolName: req.query.tool as string,
    settings: {
      mineType: req.query.minetype as string,
      state: req.query.state as string,
      commodity: req.query.commodity as string,
    },
  };

  console.log('Tool name:', query.toolName);

  console.log('QUERY PARAMS: ', query);

  const documents: string[] = await extractTextDocumentsFromFile(req.files as Express.Multer.File[]);

  if ([NodeEnvs.Production.valueOf(), NodeEnvs.ProductionLocal.valueOf()].includes(EnvVars.NodeEnv)) {
    console.log('Production mode... Querying all the documents...');

    const answer = await queryMultipleDocumentsWithSingleAnswer(documents, query);

    console.log(`TOOL: ${query.toolName} - ANSWER: `, answer);

    if (!answer) {
      console.log('No answer...');

      return res.send('An error occurred, please try again later.');
    }

    res.send(answer);
  } else {
    // Dev / Test - Mock
    res.send(mockAnswer);
  }
};

// Convert the docs and handwritten image/pdf files to text array
const extractTextDocumentsFromFile = async (files: Express.Multer.File[]): Promise<string[]> => {
  const documents: string[] = [];

  for (const file of files as Express.Multer.File[]) {
    const levelsUp = path.resolve(__dirname, '..', '..', '..');
    const originalFilePath = path.join(levelsUp, docFolder, file.filename);

    try {
      console.log('File path:', originalFilePath);

      let outputText = '';

      // TODO Check if the output text exists for this file. e.g. myFile.pdf.text
      // If it exists, skip the following conversion
      // If not, go through the following conversions and then save the new text file myFile.pdf.text

      // TODO: #43 Reuse file the (converted) text file from the previous call -  temporary solution
      const textFilePath = path.join(docFolder, file.originalname + '.txt');

      if (fs.existsSync(textFilePath)) {
        outputText = (await readFile(textFilePath)).toString();

        console.log('CONVERTED TEXT OUTPUT ALREADY FOUND: ', textFilePath);
      } else {
        if (path.extname(originalFilePath) === '.docx') {
          // Read docx file and get the plain text
          outputText = await convertWordDocToText(originalFilePath);
        } else if (viewerFileTypes.includes(path.extname(originalFilePath))) {
          // Read the handwritten or any meaningful text directly
          outputText = await convertHandwrittenFileToTextByAzure(originalFilePath);
        } else if (audioFileTypes.includes(path.extname(originalFilePath))) {
          console.log('AUDIO BEING PROCESSED: ', originalFilePath);
          // Convert audio to text
          outputText = await convertSpeechToText(originalFilePath);

          console.log('AUDIO TEXT OUTPUT: ', outputText);
        } else if (videoFileTypes.includes(path.extname(originalFilePath))) {
          // Convert to audio (.wav) with ffmpeg
          const audioFilePath = await convertVideoToAudio(originalFilePath, '.wav');

          // Convert audio to text
          outputText = await convertSpeechToText(audioFilePath);

          await fs.unlink(audioFilePath, () => {
            console.log(`Converted audio file ${audioFilePath} deleted`);
          });
        }

        // Save text output file
        await writeFile(textFilePath, outputText);

        console.log('CONVERSION TEXT OUTPUT NOT FOUND, SAVING CONVERTED TEXT: ', textFilePath);
      }

      console.log('File content converted to text');

      // Delete the file after extracting the text output
      await fs.unlink(originalFilePath, () => {
        console.log(`File ${originalFilePath} deleted`);
      });

      if (outputText) {
        console.log('The converted output text has some content');

        documents.push(outputText);
      }
    } catch (error) {
      console.log('Error processing file:', error);
    }
  }

  return documents;
};

export { getQueryAnswer, saveFiles };
