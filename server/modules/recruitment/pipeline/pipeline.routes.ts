import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { validate } from '../../../common/middleware/validate'
import { MoveEntrySchema, ShortlistSchema, RejectEntrySchema, UpdateNotesSchema } from './pipeline.schema'
import * as ctrl from './pipeline.controller'

const router = Router({ mergeParams: true })

router.get('/:reqId', authenticate, requireRole('hr', 'admin'), ctrl.getPipeline)
router.post('/:reqId/entries/:entryId/move', authenticate, requireRole('hr', 'admin'), validate(MoveEntrySchema), ctrl.moveEntry)
router.post('/:reqId/entries/:entryId/shortlist', authenticate, requireRole('hr', 'admin'), validate(ShortlistSchema), ctrl.shortlistEntry)
router.post('/:reqId/entries/:entryId/reject', authenticate, requireRole('hr', 'admin'), validate(RejectEntrySchema), ctrl.rejectEntry)
router.put('/:reqId/entries/:entryId/notes', authenticate, requireRole('hr', 'admin'), validate(UpdateNotesSchema), ctrl.updateNotes)

// Candidate profile via candidate-service
router.get('/candidates/:candidateId/profile', authenticate, requireRole('hr', 'admin'), ctrl.getCandidateView)

export default router
