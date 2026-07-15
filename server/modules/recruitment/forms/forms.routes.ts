import { Router } from 'express'
import { authenticate } from '../../../common/middleware/auth'
import { requireRole } from '../../../common/middleware/rbac'
import { validate } from '../../../common/middleware/validate'
import {
  AddFieldSchema,
  UpdateFieldSchema,
  ReorderSchema,
  SaveTemplateSchema,
  FormApprovalRemarksSchema,
  PublishFormSchema
} from './forms.schema'
import * as ctrl from './forms.controller'

// ─── Requisition Forms Router ──────────────────────────────────────────────────
// mounted at /requisitions/:reqId/form
const reqFormRouter = Router({ mergeParams: true })
reqFormRouter.use(authenticate, requireRole('hr', 'admin'))

reqFormRouter.post('/',                       ctrl.createForm)
reqFormRouter.get('/',                        ctrl.getForm)
reqFormRouter.post('/fields',                 validate(AddFieldSchema), ctrl.addField)
reqFormRouter.patch('/fields/reorder',        validate(ReorderSchema),  ctrl.reorderFields)
reqFormRouter.patch('/fields/:fid',           validate(UpdateFieldSchema), ctrl.updateField)
reqFormRouter.delete('/fields/:fid',          ctrl.deleteField)
reqFormRouter.patch('/publish',               validate(PublishFormSchema), ctrl.publishForm)

// ─── Form Approvals Router ─────────────────────────────────────────────────────
// mounted at /form-approvals
const approvalsRouter = Router()
approvalsRouter.use(authenticate)

approvalsRouter.get('/pending',                        requireRole('admin'), ctrl.getPendingApprovals)
approvalsRouter.get('/form/:formId',                   requireRole('hr', 'admin'), ctrl.getFormApprovalStatus)
approvalsRouter.post('/:approvalId/approve',           requireRole('admin'), ctrl.approveForm)
approvalsRouter.post('/:approvalId/reject',            requireRole('admin'), ctrl.rejectForm)
approvalsRouter.post('/:approvalId/request-changes',   requireRole('admin'), validate(FormApprovalRemarksSchema), ctrl.requestFormChanges)

// ─── Question Templates Router ─────────────────────────────────────────────────
// mounted at /question-templates
const templatesRouter = Router()
templatesRouter.use(authenticate, requireRole('hr', 'admin'))

templatesRouter.get('/',  ctrl.getQuestionTemplates)
templatesRouter.post('/', validate(SaveTemplateSchema), ctrl.saveQuestionTemplate)

export { reqFormRouter, approvalsRouter, templatesRouter }
