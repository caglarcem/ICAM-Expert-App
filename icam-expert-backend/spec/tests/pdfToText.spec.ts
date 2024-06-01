import { getQueryAnswer } from '../../src/rest/queryDocuments/queryDocuments.controller';
import { Request, Response } from 'express';

describe('UserRouter', () => {
  beforeAll(done => {
    // Setup tasks, if any
    done();
  });

  describe('Test placeholder', () => {
    it('should succeed', done => {
      expect('cem').toEqual('cem');
      done();
    });
  });

  describe('getQueryAnswer Functionality', () => {
    it('should return 400 if no files are uploaded', () => {
      // Define the type for the Request object
      interface CustomRequest extends Request {
        files: Express.Multer.File[]; // Adjust the type of 'files' property as needed
      }

      // Create a mock Request object
      const req: Partial<CustomRequest> = { files: [] };

      const res = {
        status: jasmine.createSpy().and.returnValue({
          send: jasmine.createSpy(),
        }),
      } as unknown as Response; // Assuming you have defined the Response type correctly

      getQueryAnswer(req as CustomRequest, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status(400).send).toHaveBeenCalledWith('No file uploaded.');
    });
  });
});
