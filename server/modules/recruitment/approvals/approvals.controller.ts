import { Request, Response } from 'express'
import * as service from './approvals.service'
import { getRoleNameById } from '../../admin-rbac/roles/roles.repository'

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    return res.status((err as any).statusCode ?? 500).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

// ─── Requisition Approvals ──────────────────────────────────────────────────────

export async function getApprovals(req: Request, res: Response) {
  try {
    const data = await service.getApprovals(req.params.reqId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function createApproval(req: Request, res: Response) {
  try {
    const roleName = req.body.approver_role || (await getRoleNameById(req.user!.roleId)) || ''
    const data = await service.createApproval(req.params.reqId as string, req.user!.userId, roleName)
    res.status(201).json(data)
  } catch (err) { handleError(res, err) }
}

export async function decideApproval(req: Request, res: Response) {
  try {
    const data = await service.decideApproval(req.params.id as string, req.body.status)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

// ─── Rulebooks ─────────────────────────────────────────────────────────────────

export async function getRulebooks(req: Request, res: Response) {
  try {
    const data = await service.getRulebooks(req.params.reqId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function createRulebook(req: Request, res: Response) {
  try {
    const data = await service.createRulebook(req.params.reqId as string, req.user!.userId, req.body.criteria)
    res.status(201).json(data)
  } catch (err) { handleError(res, err) }
}

export async function deleteRulebook(req: Request, res: Response) {
  try {
    const data = await service.deleteRulebook(req.params.id as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}
