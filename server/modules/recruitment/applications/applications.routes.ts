import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { validate } from '../../../common/middleware/validate'
import { UpdateStatusSchema } from './applications.schema'
import * as ctrl from './applications.controller'

// mergeParams: true so :reqId from parent router is available
const router = Router({ mergeParams: true })

router.get('/',           authenticate, requireRole('hr', 'admin'), ctrl.listApplications)
router.get('/:aid',       authenticate, requireRole('hr', 'admin'), ctrl.getApplication)
router.patch('/:aid/status', authenticate, requireRole('hr', 'admin'), validate(UpdateStatusSchema), ctrl.updateStatus)

export default router
