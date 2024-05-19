import { IReq, IRes } from '../types/express/misc';
import { convertHandwrittenPdfToTextByAzure } from '../services/pdfToText.service';
import path from 'path';
import HttpStatusCodes from '../../constants/HttpStatusCodes';

const getConvertedText = (request: IReq<{ filename: string }>, res: IRes) => {
  const { filename } = request.body;

  const levelsUp = path.resolve(__dirname, '..', '..', '..');
  const targetPath = path.resolve(levelsUp, 'uploads');
  const pdfFilePath = path.join(targetPath, filename);

  const text = convertHandwrittenPdfToTextByAzure(pdfFilePath);

  return res.status(HttpStatusCodes.OK).json({ text });
};
export { getConvertedText };
