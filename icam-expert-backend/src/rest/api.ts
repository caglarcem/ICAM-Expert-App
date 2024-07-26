import { clientDisconnectedRouter } from '@src/rest/clientDisconnected/clientDisconnected.routes';
import { pdfToTextRouter } from '@src/rest/pdfToText/pdfToText.routes';
import { queryDocumentRouter } from '@src/rest/queryDocuments/queryDocuments.routes';
import { Router } from 'express';

// import jetValidator from 'jet-validator';

const BaseRouter = Router();
// validate = jetValidator();

// Mount individual routers under the base router
BaseRouter.use('/pdfToText', pdfToTextRouter);

BaseRouter.use('/queryDocuments', queryDocumentRouter);

BaseRouter.use('/client-disconnected', clientDisconnectedRouter);

export default BaseRouter;
