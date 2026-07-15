import { Router } from 'express';
import { resumeController } from '../resume.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { uploadResume } from '../../../../common/middleware/muter.js';

const router = Router();

router.post('/upload', authenticateCandidate, uploadResume.single('resume'), resumeController.upload);
router.get('/', authenticateCandidate, resumeController.list);
router.delete('/:id', authenticateCandidate, resumeController.delete);

export default router;
