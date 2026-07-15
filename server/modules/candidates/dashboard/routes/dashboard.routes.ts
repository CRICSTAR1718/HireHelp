import { Router } from 'express';
import { dashboardController } from '../dashboard.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';

const router = Router();

router.get('/stats', authenticateCandidate, dashboardController.getStats);
router.get('/overview', authenticateCandidate, dashboardController.getOverview);

export default router;
