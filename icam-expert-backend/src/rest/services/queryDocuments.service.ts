import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const queryMultipleDocumentsWithSingleAnswer = async (
  documents: string[],
  prompt: string
): Promise<string | undefined> => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Call the OpenAI API using the client
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are now an ICAM expert in open cut coal mining in queensland. 
                    I will upload some evidence documents, please read and learn from them all.
                    I am going to ask questions based on the information in the documents.`,
        },
        {
          role: 'user',
          content: `Here is all the documents, the documents delimited by three ampersands (&&&) and their fields are delimited by two ampersands (&&). ${documents.join(
            '&&&'
          )}`,
        },
        {
          role: 'user',
          content: prompt,
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
