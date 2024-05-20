import { IReq, IRes } from '../types/express/misc';
import { convertHandwrittenPdfToTextByAzure } from '../services/pdfToText.service';
import path from 'path';
import HttpStatusCodes from '../../constants/HttpStatusCodes';
import { config } from '../../appConfig';

const getConvertedText = (request: IReq<{ filename: string }>, res: IRes) => {
  const { filename } = request.body;

  const levelsUp = path.resolve(__dirname, '..', '..', '..');
  const targetPath = path.resolve(levelsUp, config.appSettings.uploadFolder);
  const pdfFilePath = path.join(targetPath, filename);

  const text = convertHandwrittenPdfToTextByAzure(pdfFilePath);

  return res.status(HttpStatusCodes.OK).json({ text });
};
export { getConvertedText };
