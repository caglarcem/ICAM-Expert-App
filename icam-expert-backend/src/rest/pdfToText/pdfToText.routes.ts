import { Router } from 'express';
import { getConvertedText } from './pdfToText.controller';
// import jetValidator from 'jet-validator';

const pdfToTextRouter = Router();

// validate = jetValidator();
pdfToTextRouter.get('/convert', getConvertedText);

export { pdfToTextRouter };
