import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { validate } from '../../../common/middleware/validate'
import { CreateOfferSchema } from './offers.schema'
import * as ctrl from './offers.controller'

const router = Router({ mergeParams: true })

router.post('/', authenticate, requireRole('hr', 'admin'), validate(CreateOfferSchema), ctrl.createOffer)
router.get('/:id', authenticate, requireRole('hr', 'admin'), ctrl.getOffer)
router.get('/application/:applicationId', authenticate, requireRole('hr', 'admin'), ctrl.getOffersForApplication)

export default router
