import { Router } from 'express';
import { authController } from '../auth.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { validate } from '../../../../common/middleware/validate.js';
import { registerSchema, loginSchema, verifyEmailSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema } from '../auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticateCandidate, authController.me);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/verify-login-otp', validate(verifyEmailSchema), authController.verifyLoginOtp);
router.post('/resend-otp', validate(resendOtpSchema), authController.resendOtp);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-reset-otp', validate(verifyEmailSchema), authController.verifyResetOtp);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', authenticateCandidate, authController.changePassword);
router.post('/logout', authController.logout);

export default router;
