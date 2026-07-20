import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { calendarController } from './calendar.controller';
import { validate } from '../../../common/middleware/validate';
import { createCalendarIntegrationSchema, updateCalendarIntegrationSchema } from './calendar.schema';

const router = Router();
router.use(authenticate, requireRole('hr', 'admin', 'recruiter', 'interviewer'));

router.post('/', validate(createCalendarIntegrationSchema), calendarController.create.bind(calendarController));
router.get('/:id', calendarController.getById.bind(calendarController));
router.get('/interviewer/:interviewerId', calendarController.getByInterviewer.bind(calendarController));
router.put('/:id', validate(updateCalendarIntegrationSchema), calendarController.update.bind(calendarController));
router.delete('/:id', calendarController.delete.bind(calendarController));
router.post('/:id/sync', calendarController.sync.bind(calendarController));

export { router as calendarRoutes };
