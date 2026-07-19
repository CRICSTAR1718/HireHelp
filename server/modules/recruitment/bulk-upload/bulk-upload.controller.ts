import { Request, Response } from 'express';
import { bulkUploadService } from './bulk-upload.service';

export class BulkUploadController {
  async bulkUpload(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // req.files is an array when using .array()
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const { requisitionId } = req.params;
      const summary = await bulkUploadService.bulkUploadResumes(
        requisitionId,
        files,
        parseInt(req.user.userId)
      );

      res.status(200).json(summary);
    } catch (error) {
      const statusCode = (error as any).statusCode || 500;
      res.status(statusCode).json({ error: (error as Error).message });
    }
  }
}

export const bulkUploadController = new BulkUploadController();
