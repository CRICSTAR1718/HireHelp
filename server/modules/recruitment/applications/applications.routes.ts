import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { validate } from '../../../common/middleware/validate'
import { authenticateCandidate } from '../../../common/middleware/candidate-auth'
import { UpdateStatusSchema } from './applications.schema'
import * as ctrl from './applications.controller'
import { candidates } from '../../../database/schema'
import { db } from '../../../database'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

// mergeParams: true so :reqId from parent router is available
const router = Router({ mergeParams: true })

// Admin/HR routes
router.get('/',           authenticate, requireRole('hr', 'admin'), ctrl.listApplications)
router.get('/shortlisted', authenticate, requireRole('hr', 'admin'), ctrl.getShortlistedCandidates)
router.get('/:aid',       authenticate, requireRole('hr', 'admin'), ctrl.getApplication)
router.get('/:aid/ai-evaluation', authenticate, requireRole('hr', 'admin'), ctrl.getAiEvaluation)
router.patch('/:aid/status', authenticate, requireRole('hr', 'admin'), validate(UpdateStatusSchema), ctrl.updateStatus)
router.post('/:aid/recalculate', authenticate, requireRole('hr', 'admin'), ctrl.recalculateFitment)

// Candidate routes with UUID resolution middleware
const resolveCandidateUUID = async (req: any, res: any, next: any) => {
  try {
    // Log authentication info
    console.log('[Application Routes] Authenticated candidate:', {
      id: req.candidateUser?.id,
      email: req.candidateUser?.email
    })

    if (!req.candidateUser?.id) {
      console.error('[Application Routes] No candidate ID in request')
      return res.status(401).json({ error: 'Candidate not authenticated' })
    }

    // Query candidate from database
    const candidate = await db.select({ 
      id: candidates.id, 
      uuid: candidates.uuid, 
      email: candidates.email 
    }).from(candidates).where(eq(candidates.id, req.candidateUser.id)).limit(1)
    
    console.log('[Application Routes] Database query result:', {
      found: candidate.length > 0,
      candidate: candidate.length > 0 ? { id: candidate[0].id, uuid: candidate[0].uuid, email: candidate[0].email } : null
    })

    if (candidate.length === 0) {
      console.error('[Application Routes] Candidate not found in database for ID:', req.candidateUser.id)
      return res.status(404).json({ error: 'Candidate not found in database' })
    }

    // Handle NULL UUID - generate one if missing
    if (!candidate[0].uuid) {
      console.warn('[Application Routes] Candidate has NULL UUID, generating one for candidate:', candidate[0].id)
      const newUUID = randomUUID()
      await db.update(candidates)
        .set({ uuid: newUUID })
        .where(eq(candidates.id, candidate[0].id))
      
      console.log('[Application Routes] Generated and saved UUID:', newUUID)
      req.candidateId = newUUID
    } else {
      req.candidateId = candidate[0].uuid
    }

    console.log('[Application Routes] Resolved candidate UUID:', req.candidateId)
    next()
  } catch (error) {
    console.error('[Application Routes] Error resolving candidate UUID:', error)
    return res.status(500).json({ 
      error: 'Failed to process candidate ID',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

router.post('/submit', authenticateCandidate, resolveCandidateUUID, ctrl.submitApplication)

router.get('/candidate/my-applications', authenticateCandidate, resolveCandidateUUID, ctrl.getCandidateApplications)

router.get('/check/:requisitionId', authenticateCandidate, resolveCandidateUUID, ctrl.checkApplicationStatus)

export default router
