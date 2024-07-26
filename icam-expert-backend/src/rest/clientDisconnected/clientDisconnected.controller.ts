import { Request, Response } from 'express';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { config } from '../../appConfig';

const clientDisconnected = async (req: Request, res: Response) => {
  console.log('Client disconnected. Deleting previously uploaded files...');

  const docFolder = config.appSettings.uploadFolder;

  if (!fs.existsSync(docFolder)) {
    console.log('No upload folder...');
  } else {
    await removeFolder(docFolder);
  }
};

const removeFolder = async (folderPath: string): Promise<void> => {
  try {
    // Get all files inside the folder
    const files = await fsPromises.readdir(folderPath);

    // Remove each file inside the folder
    for (const file of files) {
      const filePath = join(folderPath, file);
      await fsPromises.unlink(filePath);
    }

    console.log(`Folder '${folderPath}' removed successfully`);
  } catch (error) {
    console.error(`Error removing folder '${folderPath}':`, error);
  }
};

export { clientDisconnected };
