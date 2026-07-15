import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import * as ctrl from './feedback.controller'

const router = Router({ mergeParams: true })

router.get('/:applicationId/feedback', authenticate, requireRole('hr', 'admin'), ctrl.getFeedback)

export default router
