import { Request, Response } from 'express'
import * as service from './applications.service'

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    return res.status((err as any).statusCode ?? 500).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

export async function listApplications(req: Request, res: Response) {
  try {
    const requisitionId = typeof req.query.requisitionId === 'string' ? req.query.requisitionId : undefined
    const data = await service.listApplications(requisitionId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function getApplication(req: Request, res: Response) {
  try {
    const requisitionId = typeof req.query.requisitionId === 'string' ? req.query.requisitionId : undefined
    const data = await service.getApplication(req.params.aid as string, requisitionId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const requisitionId = typeof req.query.requisitionId === 'string' ? req.query.requisitionId : undefined
    const data = await service.updateStatus(req.params.aid as string, req.body.status, requisitionId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function submitApplication(req: Request, res: Response) {
  try {
    // candidateId should come from authenticated session, not from request body
    const candidateId = (req as any).candidateId
    if (!candidateId) {
      return res.status(401).json({ error: 'Unauthorized - candidate ID missing' })
    }

    const { jobId, resumeId, responses } = req.body
    console.log('[Application Controller] Submitting application:', {
      candidateId,
      jobId,
      resumeId,
      responsesCount: responses?.length
    })
    
    const data = await service.submitApplication(candidateId, jobId, responses, resumeId)
    res.status(201).json(data)
  } catch (err) { 
    console.error('[Application Controller] Error:', err)
    handleError(res, err) 
  }
}

export async function getCandidateApplications(req: Request, res: Response) {
  try {
    const candidateId = (req as any).candidateId
    if (!candidateId) {
      return res.status(401).json({ error: 'Unauthorized - candidate ID missing' })
    }

    const data = await service.getCandidateApplications(candidateId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function checkApplicationStatus(req: Request, res: Response) {
  try {
    const candidateId = (req as any).candidateId
    if (!candidateId) {
      return res.status(401).json({ error: 'Unauthorized - candidate ID missing' })
    }

    const { requisitionId } = req.params
    const data = await service.checkApplicationStatus(candidateId, requisitionId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function recalculateFitment(req: Request, res: Response) {
  try {
    const requisitionId = typeof req.query.requisitionId === 'string' ? req.query.requisitionId : undefined
    const data = await service.recalculateFitment(req.params.aid as string, requisitionId)
    res.json(data)
  } catch (err) { handleError(res, err) }
}
