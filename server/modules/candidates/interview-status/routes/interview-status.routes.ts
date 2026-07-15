import { Router } from 'express';
import { interviewStatusController } from '../interview-status.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { validate } from '../../../../common/middleware/validate.js';
import { updateInterviewStatusSchema } from '../interview-status.schema.js';

const router = Router();

router.get('/', authenticateCandidate, interviewStatusController.list);
router.get('/:id', authenticateCandidate, interviewStatusController.getById);
router.put('/:id', authenticateCandidate, validate(updateInterviewStatusSchema), interviewStatusController.update);

export default router;
