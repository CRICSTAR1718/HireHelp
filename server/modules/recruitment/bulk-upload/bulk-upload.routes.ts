import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { uploadResumesBulk } from '../../../common/middleware/muter';
import { bulkUploadController } from './bulk-upload.controller';

const router = Router({ mergeParams: true });

router.post(
  '/:requisitionId/bulk-resumes',
  authenticate,
  requireRole('hr', 'admin'),
  uploadResumesBulk,
  bulkUploadController.bulkUpload
);

export default router;
