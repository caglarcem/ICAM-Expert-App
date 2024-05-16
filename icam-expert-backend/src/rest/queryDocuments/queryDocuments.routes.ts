import { Router } from 'express';
import 'express-async-errors';
import { saveFiles, getQueryAnswer } from './queryDocuments.controller';

const queryDocumentRouter = Router();

queryDocumentRouter.post('/report', saveFiles, getQueryAnswer);

export { queryDocumentRouter };
