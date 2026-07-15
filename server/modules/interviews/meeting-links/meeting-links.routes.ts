import { Router } from 'express';
import { authenticate } from '../../../common/middleware/auth';
import { requireRole } from '../../../common/middleware/rbac';
import { meetingLinksController } from './meeting-links.controller';
import { validate } from '../../../common/middleware/validate';
import { createMeetingLinkSchema } from './meeting-links.schema';

const router = Router();
router.use(authenticate, requireRole('hr', 'admin', 'interviewer'));

router.post('/', validate(createMeetingLinkSchema), meetingLinksController.create.bind(meetingLinksController));
router.get('/:id', meetingLinksController.getById.bind(meetingLinksController));
router.get('/schedule/:scheduleId', meetingLinksController.getBySchedule.bind(meetingLinksController));
router.delete('/:id', meetingLinksController.delete.bind(meetingLinksController));

export { router as meetingLinksRoutes };
