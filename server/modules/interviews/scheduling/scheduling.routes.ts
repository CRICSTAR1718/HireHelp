import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { schedulingController } from './scheduling.controller';
import { validate } from '../../../common/middleware/validate';
import { createScheduleSchema, updateScheduleSchema, createInterviewScheduleSchema } from './scheduling.schema';

const router = Router();
router.use(authenticate, requireRole('hr', 'admin', 'interviewer'));

router.post('/', validate(createScheduleSchema), schedulingController.create.bind(schedulingController));
router.post('/interview', validate(createInterviewScheduleSchema), schedulingController.createInterviewSchedule.bind(schedulingController));
router.get('/:id', schedulingController.getById.bind(schedulingController));
router.get('/assignment/:assignmentId', schedulingController.getByAssignment.bind(schedulingController));
router.put('/:id', validate(updateScheduleSchema), schedulingController.update.bind(schedulingController));
router.delete('/:id', schedulingController.delete.bind(schedulingController));

export { router as schedulingRoutes };
