import { Router } from 'express';
import { authController } from '../auth.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { validate } from '../../../../common/middleware/validate.js';
import { registerSchema, loginSchema } from '../auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticateCandidate, authController.me);

export default router;
