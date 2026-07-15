import { Router } from 'express'
import * as ctrl from './jobs.controller'

const router = Router()

// Public endpoints — no auth (consumed by candidate-service)
router.get('/', ctrl.listJobs)
router.get('/:id', ctrl.getJob)
router.get('/:id/form', ctrl.getJobForm)

export default router
