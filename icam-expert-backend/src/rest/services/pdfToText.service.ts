import * as fs from 'fs';
import pdf from 'pdf-parse';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import dotenv from 'dotenv';
import path from 'path';
import pdftopic from 'pdftopic';
import { error } from 'console';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';
import { PrebuiltDocumentModel } from './prebuilt/prebuilt-document';

// Supports pdf/jpeg/png/tiff formats
const convertHandwrittenPdfToTextByAzure = async (filePath: string) => {
  const endpoint = 'https://icam-expert-document-intelligence.cognitiveservices.azure.com/';
  const apiKey = '654c3920821841e8984789937357a22a';

  const readStream = fs.createReadStream(filePath);

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const poller = await client.beginAnalyzeDocument(PrebuiltDocumentModel, readStream);

  // `pages`, `tables` and `styles` are also available as in the "layout" example above, but for the sake of this
  // example we won't show them here.
  const { keyValuePairs } = await poller.pollUntilDone();

  let textResult = '';

  if (!keyValuePairs || keyValuePairs.length <= 0) {
    console.log('No key-value pairs were extracted from the document.');
  } else {
    for (const { key, value, confidence } of keyValuePairs) {
      console.log('- Key  :', `"${key.content}"`);
      console.log('  Value:', `"${value?.content ?? '<undefined>'}" (${confidence})`);

      textResult += `&& ${key.content}: ${value?.content ?? '<undefined>'}`;
    }
  }

  return textResult;
};

const convertStandardPdfToText = async (pdfFilePath: string): Promise<string | undefined> => {
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

dotenv.config();

const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const convertHandwrittenPdfToTextByCloudVision = async (pdfFilePath: string): Promise<string> => {
  let fullText = '';

  try {
    const pngOutputFilePath = await convertPdfToPng(pdfFilePath);

    if (!pngOutputFilePath) throw error('PNG file is empty');

    // Perform document text detection on the PDF file
    // TODO real
    const client = new ImageAnnotatorClient({ keyFilename: keyFilePath });

    const [result] = await client.documentTextDetection(pngOutputFilePath);
    const fullText = result.fullTextAnnotation?.text || 'No text found';

    // TODO mock
    // const fullText = 'Converted PDF text blah blah';

    return fullText;
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

    console.log('Png saved successfully');

    return pngOutputFilePath;
  } else {
    console.log('nothing in file');

    return undefined;
  }
};

export { convertStandardPdfToText, convertHandwrittenPdfToTextByCloudVision, convertHandwrittenPdfToTextByAzure };
