import { Router } from 'express';
import { profileController } from '../profile.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { authenticate } from '../../../../common/middleware/auth.js';
import { requireRole } from '../../../../common/middleware/rbac.js';
import { validate } from '../../../../common/middleware/validate.js';
import { updateProfileSchema, experienceSchema, educationSchema, skillSchema } from '../profile.schema.js';
import { uploadProfilePicture } from '../../../../common/middleware/muter.js';

const router = Router();

// Candidate routes
router.get('/', authenticateCandidate, profileController.getProfile);
router.put('/', authenticateCandidate, validate(updateProfileSchema), profileController.updateProfile);
router.post('/profile-picture', authenticateCandidate, uploadProfilePicture.single('file'), profileController.uploadProfilePicture);
router.post('/experience', authenticateCandidate, validate(experienceSchema), profileController.addExperience);
router.post('/education', authenticateCandidate, validate(educationSchema), profileController.addEducation);
router.post('/skills', authenticateCandidate, validate(skillSchema), profileController.addSkill);

// Admin/HR routes for scheduling
router.get('/all', authenticate, requireRole('hr', 'admin'), profileController.getAllCandidates);

export default router;
