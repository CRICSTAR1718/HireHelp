import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { authenticateCandidate } from '../../../common/middleware/candidate-auth'
import * as ctrl from './talent-pool.controller'

const router = Router()

// Talent Pool candidate routes - accessible by candidates (must come before /:id routes)
router.get('/check/:candidateId', authenticateCandidate, ctrl.checkCandidateInPool)
router.post('/:candidateId/apply/:jobId', authenticateCandidate, ctrl.applyForJob)

// Talent Pool routes - accessible only by Admin, Recruiter, HR
router.get('/', authenticate, requireRole('admin', 'recruiter', 'hr'), ctrl.getTalentPool)
router.get('/stats', authenticate, requireRole('admin', 'recruiter', 'hr'), ctrl.getTalentPoolStats)
router.get('/:id', authenticate, requireRole('admin', 'recruiter', 'hr'), ctrl.getTalentPoolCandidate)
router.delete('/:id', authenticate, requireRole('admin', 'recruiter', 'hr'), ctrl.removeCandidate)
router.get('/:id/resume', authenticate, requireRole('admin', 'recruiter', 'hr'), ctrl.downloadResume)

export default router
