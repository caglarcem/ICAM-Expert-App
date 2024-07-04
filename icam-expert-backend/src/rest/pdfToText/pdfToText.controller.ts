import path from 'path';
import { config } from '../../appConfig';
import HttpStatusCodes from '../../constants/HttpStatusCodes';
import { convertHandwrittenFileToTextByAzure } from '../services/pdfToText.service';
import { IReq, IRes } from '../types/express/misc';

const getConvertedText = (request: IReq<{ filename: string }>, res: IRes) => {
  const { filename } = request.body;

  const levelsUp = path.resolve(__dirname, '..', '..', '..');
  const targetPath = path.resolve(levelsUp, config.appSettings.uploadFolder);
  const pdfFilePath = path.join(targetPath, filename);

  const text = convertHandwrittenFileToTextByAzure(pdfFilePath);

  return res.status(HttpStatusCodes.OK).json({ text });
};
export { getConvertedText };
