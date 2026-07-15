import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { validate } from '../../../common/middleware/validate'
import { CreateApprovalSchema, DecideApprovalSchema, CreateRulebookSchema } from './approvals.schema'
import * as ctrl from './approvals.controller'

// ─── Requisition Approvals Router ──────────────────────────────────────────────
// mounted at /requisitions/:reqId/approvals
const approvalsRouter = Router({ mergeParams: true })
approvalsRouter.use(authenticate)

approvalsRouter.get('/',       ctrl.getApprovals)
approvalsRouter.post('/',      requireRole('admin', 'recruiter', 'hiring_manager'), validate(CreateApprovalSchema), ctrl.createApproval)
approvalsRouter.patch('/:id',  validate(DecideApprovalSchema), ctrl.decideApproval)

// ─── Rulebooks Router ──────────────────────────────────────────────────────────
// mounted at /requisitions/:reqId/rulebooks
const rulebooksRouter = Router({ mergeParams: true })
rulebooksRouter.use(authenticate)

rulebooksRouter.get('/',       ctrl.getRulebooks)
rulebooksRouter.post('/',      validate(CreateRulebookSchema), ctrl.createRulebook)
rulebooksRouter.delete('/:id', ctrl.deleteRulebook)

export { approvalsRouter, rulebooksRouter }
