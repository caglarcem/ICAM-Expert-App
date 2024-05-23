import OpenAI from 'openai';
import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

dotenv.config();

export interface Tool {
  title: string;
  name: string;
  prompt: string;
}

const readTools = (filePath: string): Tool[] => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data) as Tool[];
};

const queryMultipleDocumentsWithSingleAnswer = async (
  documents: string[],
  toolName: string
): Promise<string | undefined> => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production-local';
  const jsonFilePath = isProduction
    ? path.join(__dirname, '../../', 'tools.json')
    : path.join(__dirname, '../', 'tools.json');

  const tool = readTools(jsonFilePath)?.find(tool => tool.name === toolName);

  if (!tool) {
    throw new Error('Requested tool not found.');
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Call the OpenAI API using the client
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are the lead ICAM investigator for an incident happened at a queensland open cut coal mine. Your goal is to ensure data collected is sound, analysis is comprehensive. Aim of the ICAM is to ensure learnings are objectively determined, and S.M.A.R.T. actions are captured to prevent reoccurance. Analyse the data and answer my questions.`,
          // TODO convert to csv and download
          // in a format where the format can be copy pasted into an excel sheet.`,
        },
        {
          role: 'user',
          content: `Here is all the documents, the documents delimited by three ampersands (&&&) and their fields are delimited by two ampersands (&&). ${documents.join(
            '&&&'
          )}`,
        },
        {
          role: 'user',
          content: tool.prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    // Extract and return the answer from the API response
    const answer = chatCompletion.choices[0].message.content?.trim();

    return answer;
  } catch (error) {
    // Handle any errors that occur during the API call
    console.error('Error fetching completion:', error);
    throw error;
  }
};

export { queryMultipleDocumentsWithSingleAnswer };
