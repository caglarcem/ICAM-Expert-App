import * as mammoth from 'mammoth';

const convertWordDocToText = async (docxFilePath: string): Promise<string> => {
  let text = '';

  try {
    const result = await mammoth.extractRawText({ path: docxFilePath });
    text = result.value.trim();

    console.log('Text extracted from word successfully:');
    console.log(text);
  } catch (error) {
    console.error('Error extracting text from .docx:', error);
  }

  return text;
};

export default convertWordDocToText;
