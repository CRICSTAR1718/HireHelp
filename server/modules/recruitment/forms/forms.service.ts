import * as repo from './forms.repository'

// ─── Forms ─────────────────────────────────────────────────────────────────────

export async function createForm(requisitionId: string, userId: string) {
  const existing = await repo.findFormByRequisition(requisitionId)
  if (existing) throw Object.assign(new Error('Form already exists for this requisition'), { statusCode: 409 })
  return repo.createForm(requisitionId, userId)
}

export async function getForm(requisitionId: string) {
  const form = await repo.findFormByRequisition(requisitionId)
  if (!form) throw Object.assign(new Error('Form not found'), { statusCode: 404 })
  const fields = await repo.getFieldsWithOptions(form.id)
  return { ...form, fields }
}

export async function publishForm(requisitionId: string) {
  const form = await repo.findFormByRequisition(requisitionId)
  if (!form) throw Object.assign(new Error('Form not found'), { statusCode: 404 })
  if (form.is_published) throw Object.assign(new Error('Form is already published'), { statusCode: 400 })

  const approvals = await repo.getApprovalsForForm(form.id)
  if (approvals.some(a => a.status === 'pending')) {
    throw Object.assign(new Error('Form already has a pending approval request'), { statusCode: 400 })
  }

  const fields = await repo.getFieldsByForm(form.id)
  if (fields.length === 0) {
    throw Object.assign(new Error('Cannot publish form with no fields'), { statusCode: 400 })
  }

  const admins = await repo.getAdmins()
  if (admins.length === 0) {
    throw Object.assign(new Error('No admin users found to approve the form'), { statusCode: 400 })
  }

  await repo.createApprovalRequests(form.id, admins.map(a => a.id))
  return { message: 'Approval request sent to admins' }
}

// ─── Fields ────────────────────────────────────────────────────────────────────

export async function addField(requisitionId: string, data: any) {
  const form = await repo.findFormByRequisition(requisitionId)
  if (!form) throw Object.assign(new Error('Form not found'), { statusCode: 404 })

  const maxPos = await repo.getMaxPosition(form.id)
  const nextPosition = maxPos + 1

  const field = await repo.insertField({
    form_id: form.id,
    label: data.label,
    field_type: data.field_type,
    is_required: data.is_required ?? false,
    position: nextPosition,
    placeholder: data.placeholder ?? null,
    helper_text: data.helper_text ?? null,
    max_rating: data.max_rating ?? 5
  })

  if (data.options && (data.field_type === 'dropdown' || data.field_type === 'multi_select')) {
    await repo.insertFieldOptions(field.id, data.options)
  }

  const fields = await repo.getFieldsWithOptions(form.id)
  return fields.find(f => f.id === field.id)
}

export async function updateField(fieldId: string, data: any) {
  const field = await repo.findField(fieldId)
  if (!field) throw Object.assign(new Error('Field not found'), { statusCode: 404 })

  const updatedField = await repo.updateField(fieldId, data)

  if (data.options && (field.field_type === 'dropdown' || field.field_type === 'multi_select')) {
    await repo.replaceFieldOptions(fieldId, data.options)
  }

  const formId = field.form_id
  const fields = await repo.getFieldsWithOptions(formId)
  return fields.find(f => f.id === fieldId)
}

export async function deleteField(fieldId: string) {
  const field = await repo.findField(fieldId)
  if (!field) throw Object.assign(new Error('Field not found'), { statusCode: 404 })

  const formId = field.form_id
  await repo.deleteField(fieldId)

  const remainingFields = await repo.getFieldsByForm(formId)
  await Promise.all(remainingFields.map((f, idx) => repo.setFieldPosition(f.id, idx + 1)))
}

export async function reorderFields(order: { id: string, position: number }[]) {
  await Promise.all(order.map(o => repo.setFieldPosition(o.id, o.position)))
}

// ─── Form Approvals ────────────────────────────────────────────────────────────

export async function getPendingApprovals(approverId: string) {
  return repo.getPendingForApprover(approverId)
}

export async function getFormApprovalStatus(formId: string) {
  return repo.getFormApprovalStatus(formId)
}

export async function approveForm(approvalId: string, approverId: string) {
  const approval = await repo.findApproval(approvalId)
  if (!approval) throw Object.assign(new Error('Approval not found'), { statusCode: 404 })
  if (approval.status !== 'pending') throw Object.assign(new Error('Approval is not pending'), { statusCode: 400 })
  if (approval.approver_id !== approverId) throw Object.assign(new Error('You are not authorized to approve this form'), { statusCode: 403 })

  await repo.updateApprovalStatus(approvalId, 'approved')

  // A single admin decision is sufficient to publish a form. Close the
  // remaining requests so they no longer appear in other admins' queues.
  await repo.setFormPublished(approval.form_id, true)
  await repo.cancelPendingApprovalsForForm(approval.form_id)
  return { message: 'Form approved and published' }
}

export async function rejectForm(approvalId: string, approverId: string) {
  const approval = await repo.findApproval(approvalId)
  if (!approval) throw Object.assign(new Error('Approval not found'), { statusCode: 404 })
  if (approval.status !== 'pending') throw Object.assign(new Error('Approval is not pending'), { statusCode: 400 })
  if (approval.approver_id !== approverId) throw Object.assign(new Error('You are not authorized to reject this form'), { statusCode: 403 })

  await repo.updateApprovalStatus(approvalId, 'rejected')
  await repo.rejectAllPendingForForm(approval.form_id)
  return { message: 'Form rejected' }
}

export async function requestFormChanges(approvalId: string, approverId: string, remarks: string) {
  const approval = await repo.findApproval(approvalId)
  if (!approval) throw Object.assign(new Error('Approval not found'), { statusCode: 404 })
  if (approval.status !== 'pending') throw Object.assign(new Error('Approval is not pending'), { statusCode: 400 })
  if (approval.approver_id !== approverId) throw Object.assign(new Error('You are not authorized to request changes'), { statusCode: 403 })

  await repo.updateApprovalStatus(approvalId, 'rejected')
  await repo.rejectAllPendingForForm(approval.form_id)
  await repo.setFormRemarks(approval.form_id, remarks)
  return { message: 'Changes requested', remarks }
}

// ─── Question Templates ────────────────────────────────────────────────────────

export async function getQuestionTemplates(userId: string, category?: string) {
  const templates = await repo.findTemplates(userId, category)
  return templates.map(t => ({
    ...t,
    options: t.options ? (typeof t.options === 'string' ? JSON.parse(t.options) : t.options) : null
  }))
}

export async function saveQuestionTemplate(userId: string, data: any) {
  const existing = await repo.findExistingTemplate(userId, data.label, data.field_type)
  if (existing) {
    const updated = await repo.incrementTemplateUsage(existing.id, existing.usage_count || 0)
    return { ...updated, options: updated.options ? (typeof updated.options === 'string' ? JSON.parse(updated.options) : updated.options) : null }
  }

  const template = await repo.insertTemplate({ ...data, user_id: userId })
  return { ...template, options: template.options ? (typeof template.options === 'string' ? JSON.parse(template.options) : template.options) : null }
}
