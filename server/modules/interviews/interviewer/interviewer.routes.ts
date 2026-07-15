import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { interviewerController } from './interviewer.controller';
import { validate } from '../../../common/middleware/validate';
import { createInterviewerSchema, updateInterviewerSchema } from './interviewer.schema';

const router = Router();
router.use(authenticate, requireRole('hr', 'admin'));

router.post('/', validate(createInterviewerSchema), interviewerController.create.bind(interviewerController));
router.get('/:id', interviewerController.getById.bind(interviewerController));
router.get('/user/:userId', interviewerController.getByUserId.bind(interviewerController));
router.get('/available', interviewerController.getAvailable.bind(interviewerController));
router.get('/', interviewerController.getAll.bind(interviewerController));
router.put('/:id', validate(updateInterviewerSchema), interviewerController.update.bind(interviewerController));
router.delete('/:id', interviewerController.delete.bind(interviewerController));

export { router as interviewerRoutes };
