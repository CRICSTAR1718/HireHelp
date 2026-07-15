import { Router } from 'express';
import { resumeController } from '../resume.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';

const router = Router();

router.post('/upload', authenticateCandidate, resumeController.upload);
router.get('/', authenticateCandidate, resumeController.list);
router.delete('/:id', authenticateCandidate, resumeController.delete);

export default router;
