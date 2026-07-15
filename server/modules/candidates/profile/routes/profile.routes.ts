import { Router } from 'express';
import { profileController } from '../profile.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { validate } from '../../../../common/middleware/validate.js';
import { updateProfileSchema, experienceSchema, educationSchema, skillSchema } from '../profile.schema.js';

const router = Router();

router.get('/', authenticateCandidate, profileController.getProfile);
router.put('/', authenticateCandidate, validate(updateProfileSchema), profileController.updateProfile);
router.post('/experience', authenticateCandidate, validate(experienceSchema), profileController.addExperience);
router.post('/education', authenticateCandidate, validate(educationSchema), profileController.addEducation);
router.post('/skills', authenticateCandidate, validate(skillSchema), profileController.addSkill);

export default router;
