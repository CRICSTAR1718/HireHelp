import { db } from '../../../database'
import {
  application_forms,
  form_fields,
  field_options,
  form_approvals,
  users,
  roles,
  question_templates,
  job_requisitions
} from '../../../database/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

type FieldType = InferSelectModel<typeof form_fields>['field_type']


// ─── Forms ─────────────────────────────────────────────────────────────────────

export async function findFormByRequisition(requisitionId: string) {
  const [form] = await db.select().from(application_forms)
    .where(eq(application_forms.requisition_id, requisitionId))
  return form ?? null
}

export async function createForm(requisitionId: string, createdBy: string) {
  const [form] = await db.insert(application_forms).values({
    requisition_id: requisitionId,
    created_by: createdBy
  }).returning()
  return form
}

export async function setFormPublished(formId: string, isPublished: boolean) {
  const [form] = await db.update(application_forms)
    .set({ is_published: isPublished, updated_at: new Date() })
    .where(eq(application_forms.id, formId))
    .returning()
  return form
}

export async function setFormRemarks(formId: string, remarks: string) {
  await db.update(application_forms)
    .set({ admin_remarks: remarks, updated_at: new Date() })
    .where(eq(application_forms.id, formId))
}

// ─── Fields ────────────────────────────────────────────────────────────────────

export async function getFieldsWithOptions(formId: string) {
  const fields = await db.select().from(form_fields)
    .where(eq(form_fields.form_id, formId))
    .orderBy(asc(form_fields.position))

  return Promise.all(fields.map(async (f) => {
    if (f.field_type === 'dropdown' || f.field_type === 'multi_select') {
      const options = await db.select().from(field_options)
        .where(eq(field_options.field_id, f.id))
        .orderBy(asc(field_options.position))
      return { ...f, options }
    }
    return { ...f, options: [] }
  }))
}

export async function getMaxPosition(formId: string): Promise<number> {
  const fields = await db.select({ pos: form_fields.position }).from(form_fields)
    .where(eq(form_fields.form_id, formId))
    .orderBy(desc(form_fields.position))
  return fields[0]?.pos ?? 0
}

export async function insertField(data: {
  form_id: string
  label: string
  field_type: FieldType
  is_required?: boolean
  position: number
  placeholder?: string | null
  helper_text?: string | null
  max_rating?: number
}) {
  const [field] = await db.insert(form_fields).values(data as any).returning()
  return field
}

export async function insertFieldOptions(fieldId: string, options: { label: string }[]) {
  await db.insert(field_options).values(
    options.map((o, i) => ({ field_id: fieldId, label: o.label, position: i + 1 }))
  )
}

export async function findField(fieldId: string) {
  const [f] = await db.select().from(form_fields).where(eq(form_fields.id, fieldId))
  return f ?? null
}

export async function updateField(fieldId: string, data: Partial<{
  label: string; is_required: boolean; placeholder: string; helper_text: string; max_rating: number
}>) {
  const [f] = await db.update(form_fields).set(data as any).where(eq(form_fields.id, fieldId)).returning()
  return f
}

export async function deleteField(fieldId: string) {
  await db.delete(form_fields).where(eq(form_fields.id, fieldId))
}

export async function getFieldsByForm(formId: string) {
  return db.select().from(form_fields).where(eq(form_fields.form_id, formId)).orderBy(asc(form_fields.position))
}

export async function setFieldPosition(fieldId: string, position: number) {
  await db.update(form_fields).set({ position }).where(eq(form_fields.id, fieldId))
}

export async function replaceFieldOptions(fieldId: string, options: { label: string }[]) {
  await db.delete(field_options).where(eq(field_options.field_id, fieldId))
  if (options.length > 0) {
    await db.insert(field_options).values(
      options.map((o, i) => ({ field_id: fieldId, label: o.label, position: i + 1 }))
    )
  }
}

// ─── Form Approvals ─────────────────────────────────────────────────────────────

export async function getPendingForApprover(approverId: string) {
  return db.select({
    approval: form_approvals,
    form: application_forms,
    requisition: job_requisitions,
    requester: {
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email
    }
  })
  .from(form_approvals)
  .innerJoin(application_forms, eq(form_approvals.form_id, application_forms.id))
  .innerJoin(job_requisitions, eq(application_forms.requisition_id, job_requisitions.id))
  .innerJoin(users, eq(application_forms.created_by, users.id))
  .where(and(
    eq(form_approvals.approver_id, approverId),
    eq(form_approvals.status, 'pending')
  ))
}

export async function findApproval(approvalId: string) {
  const [a] = await db.select().from(form_approvals).where(eq(form_approvals.id, approvalId))
  return a ?? null
}

export async function updateApprovalStatus(approvalId: string, status: 'approved' | 'rejected') {
  const [a] = await db.update(form_approvals)
    .set({ status, decided_at: new Date() })
    .where(eq(form_approvals.id, approvalId))
    .returning()
  return a
}

export async function getApprovalsForForm(formId: string) {
  return db.select().from(form_approvals).where(eq(form_approvals.form_id, formId))
}

export async function rejectAllPendingForForm(formId: string) {
  await db.update(form_approvals)
    .set({ status: 'rejected', decided_at: new Date() })
    .where(and(eq(form_approvals.form_id, formId), eq(form_approvals.status, 'pending')))
}

export async function cancelPendingApprovalsForForm(formId: string) {
  await db.update(form_approvals)
    .set({ status: 'cancelled', decided_at: new Date() })
    .where(and(eq(form_approvals.form_id, formId), eq(form_approvals.status, 'pending')))
}

export async function getAdmins() {
  // CHANGED: old recruitment `users.role` was a plain string enum column.
  // admin.users.roleId is now a real FK to the `roles` table, so "admin"
  // means "user whose role row is named 'admin'" — join instead of compare.
  return db
    .select({ id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(roles.name, 'admin'))
}

export async function createApprovalRequests(formId: string, adminIds: string[]) {
  await db.insert(form_approvals).values(
    adminIds.map(id => ({
      form_id: formId,
      approver_id: id,
      approver_role: 'admin',
      status: 'pending'
    }))
  )
}

export async function getFormApprovalStatus(formId: string) {
  const [form] = await db.select().from(application_forms).where(eq(application_forms.id, formId))
  const approvals = await db.select({ approval: form_approvals, approver: users })
    .from(form_approvals)
    .innerJoin(users, eq(form_approvals.approver_id, users.id))
    .where(eq(form_approvals.form_id, formId))
  return { is_published: form?.is_published ?? false, approvals }
}

// ─── Question Templates ─────────────────────────────────────────────────────────

export async function findTemplates(userId: string, category?: string) {
  if (category === 'generic') {
    return db.select().from(question_templates).where(eq(question_templates.category, 'generic'))
      .orderBy(desc(question_templates.usage_count), asc(question_templates.label))
  }
  if (category === 'personal') {
    return db.select().from(question_templates)
      .where(and(eq(question_templates.category, 'personal'), eq(question_templates.user_id, userId)))
      .orderBy(desc(question_templates.usage_count), desc(question_templates.created_at))
  }
  // both
  const [generic, personal] = await Promise.all([
    db.select().from(question_templates).where(eq(question_templates.category, 'generic'))
      .orderBy(desc(question_templates.usage_count)),
    db.select().from(question_templates)
      .where(and(eq(question_templates.category, 'personal'), eq(question_templates.user_id, userId)))
      .orderBy(desc(question_templates.usage_count))
  ])
  return [...generic, ...personal]
}

export async function findExistingTemplate(userId: string, label: string, fieldType: FieldType) {
  const [t] = await db.select().from(question_templates)
    .where(and(
      eq(question_templates.label, label),
      eq(question_templates.field_type, fieldType),
      eq(question_templates.user_id, userId)
    ))
  return t ?? null
}

export async function incrementTemplateUsage(templateId: string, currentCount: number) {
  const [t] = await db.update(question_templates)
    .set({ usage_count: currentCount + 1 })
    .where(eq(question_templates.id, templateId))
    .returning()
  return t
}

export async function insertTemplate(data: {
  label: string; field_type: FieldType; user_id: string
  is_required?: boolean; placeholder?: string | null; helper_text?: string | null
  max_rating?: number; options?: unknown
}) {
  const [t] = await db.insert(question_templates).values({
    ...data, category: 'personal', usage_count: 1
  } as any).returning()
  return t
}
