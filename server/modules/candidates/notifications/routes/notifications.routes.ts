import { Router } from 'express';
import { notificationsController } from '../notifications.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { validate } from '../../../../common/middleware/validate.js';
import { markAsReadSchema } from '../notifications.schema.js';

const router = Router();

router.get('/', authenticateCandidate, notificationsController.list);
router.get('/unread-count', authenticateCandidate, notificationsController.getUnreadCount);
router.post('/mark-read', authenticateCandidate, validate(markAsReadSchema), notificationsController.markAsRead);
router.post('/mark-all-read', authenticateCandidate, notificationsController.markAllAsRead);

export default router;
