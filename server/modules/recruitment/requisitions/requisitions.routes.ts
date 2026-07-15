import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { validate } from '../../../common/middleware/validate'
import {
  CreateRequisitionSchema,
  UpdateRequisitionSchema,
  RejectSchema,
  RequestChangesSchema,
  CloseSchema,
  SubmitSchema,
  UnderReviewSchema,
  ApproveSchema,
  PublishSchema
} from './requisitions.schema'
import * as ctrl from './requisitions.controller'

const router = Router()

router.get('/',    authenticate, ctrl.getAll)
router.get('/:id', authenticate, ctrl.getOne)

router.post('/',    authenticate, requireRole('hr', 'admin'), validate(CreateRequisitionSchema),   ctrl.create)
router.put('/:id',  authenticate, requireRole('hr', 'admin'), validate(UpdateRequisitionSchema),   ctrl.update)
router.delete('/:id', authenticate, requireRole('hr', 'admin'), ctrl.remove)

router.post('/:id/submit',          authenticate, requireRole('hr', 'admin'),  validate(SubmitSchema),       ctrl.submit)
router.post('/:id/under-review',    authenticate, requireRole('admin'),         validate(UnderReviewSchema),   ctrl.markUnderReview)
router.post('/:id/approve',         authenticate, requireRole('admin'),         validate(ApproveSchema),      ctrl.approve)
router.post('/:id/reject',          authenticate, requireRole('admin'),         validate(RejectSchema),        ctrl.reject)
router.post('/:id/request-changes', authenticate, requireRole('admin'),         validate(RequestChangesSchema), ctrl.requestChanges)
router.post('/:id/publish',         authenticate, requireRole('admin'),         validate(PublishSchema),      ctrl.publish)
router.post('/:id/close',           authenticate, requireRole('admin'),         validate(CloseSchema),        ctrl.close)

export default router
