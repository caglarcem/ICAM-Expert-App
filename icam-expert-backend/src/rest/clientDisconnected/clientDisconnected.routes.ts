import { Router } from 'express';
import 'express-async-errors';
import { clientDisconnected } from './clientDisconnected.controller';

const clientDisconnectedRouter = Router();

clientDisconnectedRouter.post('/', clientDisconnected);

export { clientDisconnectedRouter };
