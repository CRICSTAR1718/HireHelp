import { Request, Response } from 'express'
import * as service from './requisitions.service'
import { getRoleNameById } from '../../admin-rbac/roles/roles.repository'

// CHANGED: req.user.role (a plain string) doesn't exist on the merged
// JwtPayload — only req.user.roleId (uuid) does, since staff auth now comes
// from admin-rbac's real RBAC model. submit() needs the role NAME for a
// real business rule (hr must have a form before submitting), so resolve
// it here rather than changing the service's signature.

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    const code = (err as any).statusCode ?? 500
    return res.status(code).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

export async function getAll(req: Request, res: Response) {
  try {
    const rows = await service.getAll()
    res.json(rows)
  } catch (err) { handleError(res, err) }
}

export async function getOne(req: Request, res: Response) {
  try {
    const row = await service.getOne(req.params.id as string)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function create(req: Request, res: Response) {
  try {
    const body = req.body
    const parsedTarget = body.target_joining_date ? new Date(body.target_joining_date) : null
    const parsedDeadline = body.application_deadline ? new Date(body.application_deadline) : null
    let parsedDocs = null
    if (body.additional_documents) {
      try {
        parsedDocs = typeof body.additional_documents === 'string'
          ? JSON.parse(body.additional_documents)
          : body.additional_documents
      } catch { parsedDocs = null }
    }

    const roleName = (await getRoleNameById(req.user!.roleId)) ?? ''
    const row = await service.createRequisition(
      {
        ...body,
        hiring_manager_id: body.hiring_manager_id || req.user!.userId,
        target_joining_date: parsedTarget,
        application_deadline: parsedDeadline,
        additional_documents: parsedDocs,
        created_by: req.user!.userId,
        status: 'draft' as const
      },
      req.user!.userId,
      roleName
    )
    res.status(201).json(row)
  } catch (err) { handleError(res, err) }
}

export async function update(req: Request, res: Response) {
  try {
    const body = req.body
    const updateData: Record<string, unknown> = {}
    const allowedFields = [
      'title','department','team','location','employment_type','work_mode',
      'number_of_openings','about_role','responsibilities','required_skills',
      'preferred_skills','experience_required','education_requirements','salary',
      'benefits','recruiter_id','hiring_priority','internal_application_form',
      'job_description_document'
    ]
    for (const f of allowedFields) {
      if (body[f] !== undefined) updateData[f] = body[f]
    }
    if (body.target_joining_date !== undefined)
      updateData.target_joining_date = body.target_joining_date ? new Date(body.target_joining_date) : null
    if (body.application_deadline !== undefined)
      updateData.application_deadline = body.application_deadline ? new Date(body.application_deadline) : null
    if (body.additional_documents !== undefined) {
      try {
        updateData.additional_documents = typeof body.additional_documents === 'string'
          ? JSON.parse(body.additional_documents)
          : body.additional_documents
      } catch { updateData.additional_documents = null }
    }

    const row = await service.updateRequisition(req.params.id as string, updateData)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function submit(req: Request, res: Response) {
  try {
    const roleName = (await getRoleNameById(req.user!.roleId)) ?? ''
    const row = await service.submit(req.params.id as string, req.user!.userId, roleName)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function markUnderReview(req: Request, res: Response) {
  try {
    const row = await service.markUnderReview(req.params.id as string, req.user!.userId)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function approve(req: Request, res: Response) {
  try {
    const row = await service.approve(req.params.id as string, req.user!.userId)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function reject(req: Request, res: Response) {
  try {
    const { rejection_reason } = req.body
    const row = await service.reject(req.params.id as string, req.user!.userId, rejection_reason)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function requestChanges(req: Request, res: Response) {
  try {
    const { admin_remarks } = req.body
    const row = await service.requestChanges(req.params.id as string, req.user!.userId, admin_remarks)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function publish(req: Request, res: Response) {
  try {
    const row = await service.publish(req.params.id as string, req.user!.userId)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function close(req: Request, res: Response) {
  try {
    const { closed_reason } = req.body
    const row = await service.close(req.params.id as string, req.user!.userId, closed_reason)
    res.json(row)
  } catch (err) { handleError(res, err) }
}

export async function remove(req: Request, res: Response) {
  try {
    const result = await service.deleteRequisition(req.params.id as string)
    res.json(result)
  } catch (err) { handleError(res, err) }
}
