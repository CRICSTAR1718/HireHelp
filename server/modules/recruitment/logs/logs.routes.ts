import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import * as ctrl from './logs.controller'

const router = Router({ mergeParams: true })
router.use(authenticate)

router.get('/', ctrl.getStatusLogs)

export default router
