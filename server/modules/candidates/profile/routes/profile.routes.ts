import { Router } from 'express';
import { profileController } from '../profile.controller.js';
import { authenticateCandidate } from '../../../../common/middleware/candidate-auth.js';
import { validate } from '../../../../common/middleware/validate.js';
import { updateProfileSchema, experienceSchema, educationSchema, skillSchema } from '../profile.schema.js';
import multer, { FileFilterCallback } from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

const router = Router();

router.get('/', authenticateCandidate, profileController.getProfile);
router.put('/', authenticateCandidate, validate(updateProfileSchema), profileController.updateProfile);
router.post('/profile-picture', authenticateCandidate, upload.single('file'), profileController.uploadProfilePicture);
router.post('/experience', authenticateCandidate, validate(experienceSchema), profileController.addExperience);
router.post('/education', authenticateCandidate, validate(educationSchema), profileController.addEducation);
router.post('/skills', authenticateCandidate, validate(skillSchema), profileController.addSkill);

export default router;
