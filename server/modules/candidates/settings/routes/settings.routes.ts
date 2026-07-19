import { Router } from 'express';
import { settingsController } from '../settings.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';

const router = Router();

router.get('/', authenticateCandidate, settingsController.getSettings);
router.put('/email-preferences', authenticateCandidate, settingsController.updateEmailPreferences);
router.put('/privacy', authenticateCandidate, settingsController.updatePrivacySettings);
router.delete('/account', authenticateCandidate, settingsController.deleteAccount);

export default router;
