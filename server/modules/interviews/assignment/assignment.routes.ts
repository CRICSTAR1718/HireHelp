import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { assignmentController } from './assignment.controller';
import { validate } from '../../../common/middleware/validate';
import { createAssignmentSchema, updateAssignmentSchema, assignAndScheduleSchema } from './assignment.schema';

const router = Router();
router.use(authenticate);

router.post('/', requireRole('hr', 'admin'), validate(createAssignmentSchema), assignmentController.create.bind(assignmentController));
router.post('/assign-and-schedule', requireRole('hr', 'admin'), validate(assignAndScheduleSchema), assignmentController.assignAndSchedule.bind(assignmentController));
router.get('/', requireRole('hr', 'admin', 'recruiter'), assignmentController.getAll.bind(assignmentController));
router.get('/interviewer/me', requireRole('hr', 'admin', 'interviewer'), assignmentController.getByInterviewer.bind(assignmentController));
router.get('/interviewer/:interviewerId', requireRole('hr', 'admin', 'interviewer'), assignmentController.getByInterviewer.bind(assignmentController));
router.get('/:id', requireRole('hr', 'admin', 'interviewer'), assignmentController.getById.bind(assignmentController));
router.put('/:id', requireRole('hr', 'admin', 'interviewer'), validate(updateAssignmentSchema), assignmentController.update.bind(assignmentController));
router.delete('/:id', requireRole('hr', 'admin'), assignmentController.delete.bind(assignmentController));

export { router as assignmentRoutes };
