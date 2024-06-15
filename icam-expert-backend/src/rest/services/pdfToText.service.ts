import * as fs from 'fs';
import pdf from 'pdf-parse';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import dotenv from 'dotenv';
import path from 'path';
import pdftopic from 'pdftopic';
import { error } from 'console';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';
import { PrebuiltDocumentModel } from './prebuilt/prebuilt-document';
import EnvVars from '@src/constants/EnvVars';
import { NodeEnvs } from '@src/constants/misc';

dotenv.config();

// Supports pdf/jpeg/png/tiff formats
const convertHandwrittenPdfToTextByAzure = async (filePath: string) => {
  if (![NodeEnvs.Production.valueOf(), NodeEnvs.ProductionLocal.valueOf()].includes(EnvVars.NodeEnv)) {
    await fs.unlink(filePath, () => {
      console.log(`File ${filePath} deleted`);
    });
    // Dev / Test
    return mockWitnessReport;
  }

  const endpoint = process.env.AZURE_COGNITIVE_SERVICES_URL;
  const apiKey = process.env.AZURE_COGNITIVE_SERVICES_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Azure cognitive services endpoint url or api key must be configured.');
  }

  const readStream = fs.createReadStream(filePath);

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const poller = await client.beginAnalyzeDocument(PrebuiltDocumentModel, readStream);
  const { keyValuePairs } = await poller.pollUntilDone();

  let textResult = '';

  if ([NodeEnvs.Production.valueOf(), NodeEnvs.ProductionLocal.valueOf()].includes(EnvVars.NodeEnv)) {
    if (!keyValuePairs || keyValuePairs.length <= 0) {
      console.error('No key-value pairs were extracted from the document.');
    } else {
      for (const { key, value, confidence } of keyValuePairs) {
        textResult += `&& ${key.content}: ${value?.content ?? '<undefined>'}`;
      }
    }
  } else {
    // Dev / Test - Mock
    textResult = mockWitnessReport;
  }

  await fs.unlink(filePath, () => {
    console.log(`File ${filePath} deleted`);
  });

  return textResult;
};

const convertStandardPdfToText = async (pdfFilePath: string): Promise<string | undefined> => {
  console.log('Standard pdf conversion (digital, no handwritten)');

  try {
    // Load PDF file
    const pdfFile = fs.readFileSync(path.resolve(__dirname, pdfFilePath));

    // Extract text from PDF
    const result: pdf.Result = await pdf(pdfFile);

    return result.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
  }
};

const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const convertHandwrittenPdfToTextByCloudVision = async (pdfFilePath: string): Promise<string> => {
  let fullText = '';

  try {
    const pngOutputFilePath = await convertPdfToPng(pdfFilePath);

    if (!pngOutputFilePath) throw error('PNG file is empty');

    // Perform document text detection on the PDF file
    if ([NodeEnvs.Production.valueOf(), NodeEnvs.ProductionLocal.valueOf()].includes(EnvVars.NodeEnv)) {
      const client = new ImageAnnotatorClient({ keyFilename: keyFilePath });

      const [result] = await client.documentTextDetection(pngOutputFilePath);
      const fullText = result.fullTextAnnotation?.text || 'No text found';
      return fullText;
    } else {
      return mockWitnessReport;
    }
  } catch (err) {
    console.error('Error performing OCR:', err);
  }

  return fullText;
};

// CAUTION This library needs to have ImageMagick installed in the container and server
// e.g.	RUN apt-get update && \apt-get install -y imagemagick
const convertPdfToPng = async (pdfFilePath: string): Promise<string | undefined> => {
  const curriculum_vitae = fs.readFileSync(pdfFilePath);

  const pdfBuffers = await pdftopic.pdftobuffer(curriculum_vitae, 'all');

  if (pdfBuffers && pdfBuffers.length > 0) {
    const concat_converted_result = await pdftopic.bufferstoappend(pdfBuffers);
    const pdfFilename = path.basename(pdfFilePath);

    // TODO cleanup the png files later
    const twoLevelsUp = path.resolve(__dirname, '..', '..', '..');
    const pngOutputPath = path.resolve(twoLevelsUp, 'convertedPngFiles');

    // Convert 'myFile.pdf' to 'myFile.png'
    const baseWithoutExt = path.basename(pdfFilename, path.extname(pdfFilename));
    const pngFilename = baseWithoutExt + '.png';

    const pngOutputFilePath = `${pngOutputPath}/${pngFilename}`;
    fs.writeFileSync(pngOutputFilePath, concat_converted_result, { flag: 'w' });

    return pngOutputFilePath;
  } else {
    console.error('nothing in file');

    return undefined;
  }
};

export { convertStandardPdfToText, convertHandwrittenPdfToTextByCloudVision, convertHandwrittenPdfToTextByAzure };

const mockWitnessReport = `"Step by step description leading up to and including the event (specific locations, times, tasks carried out, communications):"
  												"We had moved all equipment to the site in the R30, natural area, set up site and finished installing the PVC pre collor and 
													diverter. Once the diventer was in place I moved the support track from the rear of the wig truck to the front of the vig truck and compressor. Once parked and stable
													I helped the other offsider and the driller with installing the ##blooie like they went back to the support truck and 
													connected the 2" water hose from the bean pump to the support track. I then climbed onto the rear of the truck to pull 
													out the fuel nozzle from the reel when I heard the driller yell "shut it down" and heard the ring Shot down. I climbed
													down from the truck and want to the deck where I saw the injured offsider so Iwent
													to the ute to put up the tailgate and stort it so we could make our way to the ERT. After starting the ute went back 
													to the support truck and shout it off while the driller shut of the compressor and Ept a clean rag for the injured 
													offsider to hold over his finger. We then all got in the ute and I drove straight to the ERT."`;
