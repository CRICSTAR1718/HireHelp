import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { remindersController } from './reminders.controller';
import { validate } from '../../../common/middleware/validate';
import { createReminderSchema, updateReminderSchema } from './reminders.schema';

const router = Router();
router.use(authenticate, requireRole('hr', 'admin'));

router.post('/', validate(createReminderSchema), remindersController.create.bind(remindersController));
router.get('/:id', remindersController.getById.bind(remindersController));
router.get('/schedule/:scheduleId', remindersController.getBySchedule.bind(remindersController));
router.get('/pending/all', remindersController.getPending.bind(remindersController));
router.put('/:id', validate(updateReminderSchema), remindersController.update.bind(remindersController));
router.delete('/:id', remindersController.delete.bind(remindersController));
router.post('/:id/mark-sent', remindersController.markAsSent.bind(remindersController));

export { router as remindersRoutes };
