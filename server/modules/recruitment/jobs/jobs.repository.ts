import { db } from '../../../database'
import {
  job_requisitions, users, application_forms
} from '../../../database/schema'
import { eq, and, sql } from 'drizzle-orm'

// NOTE: the old recruitment-service `users` table had a single `full_name`
// column. Since the merge, `users` now comes from the admin module's real
// RBAC table, which stores `firstName`/`lastName` separately. This concat
// reproduces the old `full_name` shape so downstream consumers (API
// responses, frontend) don't need to change.
const fullNameSql = sql<string>`${users.firstName} || ' ' || ${users.lastName}`

export async function getPublishedJobs() {
  return db.select({
    id:             job_requisitions.id,
    memo_no:        job_requisitions.memo_no,
    title:          job_requisitions.title,
    department:     job_requisitions.department,
    location:       job_requisitions.location,
    employment_type: job_requisitions.employment_type,
    work_mode:       job_requisitions.work_mode,
    number_of_openings: job_requisitions.number_of_openings,
    published_at:   job_requisitions.published_at,
    application_deadline: job_requisitions.application_deadline,
    hiring_manager: fullNameSql,
  })
  .from(job_requisitions)
  .innerJoin(users, eq(job_requisitions.hiring_manager_id, users.id))
  .innerJoin(application_forms, eq(job_requisitions.id, application_forms.requisition_id))
  .where(
    and(
      eq(job_requisitions.status, 'published'),
      eq(application_forms.is_published, true)
    )
  )
}

export async function getPublishedJobById(id: string) {
  const [job] = await db.select({
    id:                   job_requisitions.id,
    memo_no:              job_requisitions.memo_no,
    title:                job_requisitions.title,
    department:           job_requisitions.department,
    team:                 job_requisitions.team,
    location:             job_requisitions.location,
    employment_type:      job_requisitions.employment_type,
    work_mode:            job_requisitions.work_mode,
    number_of_openings:   job_requisitions.number_of_openings,
    about_role:           job_requisitions.about_role,
    responsibilities:     job_requisitions.responsibilities,
    required_skills:      job_requisitions.required_skills,
    preferred_skills:     job_requisitions.preferred_skills,
    experience_required:  job_requisitions.experience_required,
    education_requirements: job_requisitions.education_requirements,
    salary:               job_requisitions.salary,
    benefits:             job_requisitions.benefits,
    hiring_manager:       fullNameSql,
    hiring_manager_email: users.email,
    application_deadline: job_requisitions.application_deadline,
    published_at:         job_requisitions.published_at
  })
  .from(job_requisitions)
  .innerJoin(users, eq(job_requisitions.hiring_manager_id, users.id))
  .innerJoin(application_forms, eq(job_requisitions.id, application_forms.requisition_id))
  .where(
    and(
      eq(job_requisitions.id, id),
      eq(job_requisitions.status, 'published'),
      eq(application_forms.is_published, true)
    )
  )
  return job ?? null
}
