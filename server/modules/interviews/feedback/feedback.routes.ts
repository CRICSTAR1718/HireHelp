import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { feedbackController } from './feedback.controller';
import { validate } from '../../../common/middleware/validate';
import { createFeedbackSchema } from './feedback.schema';

const router = Router();
router.use(authenticate, requireRole('interviewer', 'hr', 'admin'));

router.post('/', validate(createFeedbackSchema), feedbackController.create.bind(feedbackController));
router.get('/:id', feedbackController.getById.bind(feedbackController));
router.get('/assignment/:assignmentId', feedbackController.getByAssignment.bind(feedbackController));
router.get('/interviewer/:interviewerId', feedbackController.getByInterviewer.bind(feedbackController));

export { router as feedbackRoutes };
