import { db } from '../../../database'
import {
  job_requisitions,
  users,
  requisition_status_logs,
  application_forms
} from '../../../database/schema'
import { eq, desc, sql } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

type RequisitionStatus = InferSelectModel<typeof job_requisitions>['status']

// See jobs.repository.ts for why this exists — admin.users has
// firstName/lastName, not the old recruitment `users.full_name` column.
const fullNameSql = sql<string>`${users.firstName} || ' ' || ${users.lastName}`


const LIST_FIELDS = {
  id:                 job_requisitions.id,
  memo_no:            job_requisitions.memo_no,
  title:              job_requisitions.title,
  department:         job_requisitions.department,
  team:               job_requisitions.team,
  location:           job_requisitions.location,
  employment_type:    job_requisitions.employment_type,
  work_mode:          job_requisitions.work_mode,
  number_of_openings: job_requisitions.number_of_openings,
  status:             job_requisitions.status,
  hiring_priority:    job_requisitions.hiring_priority,
  created_at:         job_requisitions.created_at,
  updated_at:         job_requisitions.updated_at,
  published_at:       job_requisitions.published_at,
  closed_at:          job_requisitions.closed_at,
  rejection_reason:   job_requisitions.rejection_reason,
  admin_remarks:      job_requisitions.admin_remarks,
  hiring_manager_id:  job_requisitions.hiring_manager_id,
  hiring_manager:     fullNameSql,
  hiring_manager_email: users.email,
  created_by:         job_requisitions.created_by
}

export async function findAll() {
  return db
    .select(LIST_FIELDS)
    .from(job_requisitions)
    .leftJoin(users, eq(job_requisitions.hiring_manager_id, users.id))
    .orderBy(desc(job_requisitions.created_at))
}

export async function findOne(id: string) {
  const [row] = await db
    .select({
      ...LIST_FIELDS,
      about_role:               job_requisitions.about_role,
      responsibilities:         job_requisitions.responsibilities,
      required_skills:          job_requisitions.required_skills,
      preferred_skills:         job_requisitions.preferred_skills,
      experience_required:      job_requisitions.experience_required,
      education_requirements:   job_requisitions.education_requirements,
      salary:                   job_requisitions.salary,
      benefits:                 job_requisitions.benefits,
      recruiter_id:             job_requisitions.recruiter_id,
      target_joining_date:      job_requisitions.target_joining_date,
      application_deadline:     job_requisitions.application_deadline,
      internal_application_form: job_requisitions.internal_application_form,
      job_description_document:  job_requisitions.job_description_document,
      additional_documents:      job_requisitions.additional_documents,
      closed_reason:             job_requisitions.closed_reason,
    })
    .from(job_requisitions)
    .leftJoin(users, eq(job_requisitions.hiring_manager_id, users.id))
    .where(eq(job_requisitions.id, id))
  return row ?? null
}

export async function findStatus(id: string) {
  const [row] = await db
    .select({ status: job_requisitions.status, created_by: job_requisitions.created_by, memo_no: job_requisitions.memo_no })
    .from(job_requisitions)
    .where(eq(job_requisitions.id, id))
  return row ?? null
}

export async function create(data: {
  title: string
  department?: string | null
  team?: string | null
  location?: string | null
  employment_type?: string | null
  work_mode?: string | null
  number_of_openings?: number
  about_role?: string | null
  responsibilities?: string | null
  required_skills?: string | null
  preferred_skills?: string | null
  experience_required?: string | null
  education_requirements?: string | null
  salary?: string | null
  benefits?: string | null
  hiring_manager_id: string
  recruiter_id?: string | null
  hiring_priority?: string | null
  target_joining_date?: Date | null
  application_deadline?: Date | null
  internal_application_form?: boolean
  job_description_document?: string | null
  additional_documents?: unknown
  created_by: string
  status: RequisitionStatus
  published_at?: Date | null
}) {
  const [row] = await db.insert(job_requisitions).values(data as any).returning()
  return row
}

export async function update(id: string, data: Record<string, unknown>) {
  const [row] = await db
    .update(job_requisitions)
    .set({ ...data, updated_at: new Date() } as any)
    .where(eq(job_requisitions.id, id))
    .returning()
  return row
}

export async function transition(
  id: string,
  toStatus: RequisitionStatus,
  changedBy: string,
  extra: Record<string, unknown> = {},
  remarks?: string
) {
  const [row] = await db
    .update(job_requisitions)
    .set({ status: toStatus, updated_at: new Date(), ...extra } as any)
    .where(eq(job_requisitions.id, id))
    .returning()

  await db.insert(requisition_status_logs).values({
    requisition_id: id,
    from_status: row.status,  // already updated above; log the previous status via extra
    to_status: toStatus,
    changed_by: changedBy,
    remarks
  })

  return row
}

export async function logTransition(
  requisitionId: string,
  fromStatus: RequisitionStatus | null,
  toStatus: RequisitionStatus,
  changedBy: string,
  remarks?: string
) {
  await db.insert(requisition_status_logs).values({
    requisition_id: requisitionId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_by: changedBy,
    remarks
  } as any)
}

export async function getFormForRequisition(requisitionId: string) {
  const [form] = await db
    .select()
    .from(application_forms)
    .where(eq(application_forms.requisition_id, requisitionId))
  return form ?? null
}

export async function remove(id: string) {
  const [deleted] = await db
    .delete(job_requisitions)
    .where(eq(job_requisitions.id, id))
    .returning()
  return deleted ?? null
}

export async function generateMemoNo(): Promise<string> {
  // Format: REQ-YYYYMM-XXXX (auto-increment based on month count)
  const now = new Date()
  const prefix = `REQ-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`

  // `memo_no` has a table-wide unique constraint, so consider every
  // requisition that already has a memo. Restricting this to `submitted`
  // rows can regenerate a number assigned to an approved/published record.
  const existing = await db
    .select({ memo_no: job_requisitions.memo_no })
    .from(job_requisitions)

  const monthMemos = existing
    .map(r => r.memo_no)
    .filter((m): m is string => m != null && m.startsWith(prefix))

  const nextSequence = monthMemos.reduce((highest, memo) => {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(memo)
    return Math.max(highest, match ? Number(match[1]) : 0)
  }, 0) + 1

  return `${prefix}-${String(nextSequence).padStart(4, '0')}`
}
