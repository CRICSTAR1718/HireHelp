import { Request, Response } from 'express'
import * as service from './forms.service'

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    return res.status((err as any).statusCode ?? 500).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

// ─── Forms ─────────────────────────────────────────────────────────────────────

export async function createForm(req: Request, res: Response) {
  try {
    const data = await service.createForm(req.params.requisitionId as string, req.user!.userId)
    res.status(201).json(data)
  } catch (err) { handleError(res, err) }
}

export async function getForm(req: Request, res: Response) {
  try {
    const data = await service.getForm(req.params.requisitionId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function publishForm(req: Request, res: Response) {
  try {
    const data = await service.publishForm(req.params.requisitionId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

// ─── Fields ────────────────────────────────────────────────────────────────────

export async function addField(req: Request, res: Response) {
  try {
    const data = await service.addField(req.params.requisitionId as string, req.body)
    res.status(201).json(data)
  } catch (err) { handleError(res, err) }
}

export async function updateField(req: Request, res: Response) {
  try {
    const data = await service.updateField(req.params.fid as string, req.body)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function deleteField(req: Request, res: Response) {
  try {
    await service.deleteField(req.params.fid as string)
    res.json({ message: 'Field deleted' })
  } catch (err) { handleError(res, err) }
}

export async function reorderFields(req: Request, res: Response) {
  try {
    await service.reorderFields(req.body.order)
    res.json({ message: 'Reordered' })
  } catch (err) { handleError(res, err) }
}

// ─── Form Approvals ────────────────────────────────────────────────────────────

export async function getPendingApprovals(req: Request, res: Response) {
  try {
    const data = await service.getPendingApprovals(req.user!.userId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function getFormApprovalStatus(req: Request, res: Response) {
  try {
    const data = await service.getFormApprovalStatus(req.params.formId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function approveForm(req: Request, res: Response) {
  try {
    const data = await service.approveForm(req.params.approvalId as string, req.user!.userId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function rejectForm(req: Request, res: Response) {
  try {
    const data = await service.rejectForm(req.params.approvalId as string, req.user!.userId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function requestFormChanges(req: Request, res: Response) {
  try {
    const data = await service.requestFormChanges(req.params.approvalId as string, req.user!.userId, req.body.remarks)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

// ─── Question Templates ────────────────────────────────────────────────────────

export async function getQuestionTemplates(req: Request, res: Response) {
  try {
    const data = await service.getQuestionTemplates(req.user!.userId, req.query.category as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function saveQuestionTemplate(req: Request, res: Response) {
  try {
    const data = await service.saveQuestionTemplate(req.user!.userId, req.body)
    res.status(201).json(data)
  } catch (err) { handleError(res, err) }
}
