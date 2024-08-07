import dotenv from 'dotenv';
import * as fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import { QueryParameters } from '../types/types';

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
  queryParameters: QueryParameters
): Promise<string | undefined> => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production-local';
  const jsonFilePath = isProduction
    ? path.join(__dirname, '../../', 'tools.json')
    : path.join(__dirname, '../', 'tools.json');

  const tool = readTools(jsonFilePath)?.find(tool => tool.name === queryParameters.toolName);

  console.log('TOOL: ', tool?.title);

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
          content: `Can you please act as the lead ICAM investigator with relevant operational experience for an incident 
										happened at a ${queryParameters.settings.state} ${queryParameters.settings.mineType} ${queryParameters.settings.commodity} mine? Your goal is to ensure analysis is comprehensive. Aim 
										of the ICAM is to ensure learnings are objectively determined. Analyse the data and answer my following 
										questions. Please do not answer yet until I ask specific questions. On the following questions only use 
										the information provided in this session. Stick to the factual information provided when analysing the incident. Thank you very much!`,
        },
        {
          role: 'user',
          content: `Here is all the documents, the documents are delimited by three ampersands (&&&) and their fields are delimited by two ampersands (&&). ${documents.join(
            '&&&'
          )}`,
        },
        {
          role: 'user',
          content: tool.prompt,
        },
      ],
      model: 'gpt-4o',
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
