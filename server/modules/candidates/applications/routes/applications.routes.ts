import { Router } from 'express';
import { applicationsController } from '../applications.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { validate } from '../../../../common/middleware/validate.js';
import { applyJobSchema } from '../applications.schema.js';

const router = Router();

router.get('/', authenticateCandidate, applicationsController.list);
router.get('/:id', authenticateCandidate, applicationsController.getById);
router.post('/', authenticateCandidate, validate(applyJobSchema), applicationsController.apply);

export default router;
