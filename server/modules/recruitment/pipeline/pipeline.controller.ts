import { Request, Response } from 'express'
import * as service from './pipeline.service'
import { profileService } from '../../candidates/profile/profile.service'

// CHANGED: previously called candidate-service over HTTP via
// clients/candidate.client.ts, which never existed in this repo (a build
// error, not just a merge gap — the file was referenced but not committed).
// Candidate profile lookups are now an in-process call.

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    const code = (err as any).statusCode ?? 500
    return res.status(code).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

export async function getPipeline(req: Request, res: Response) {
  try {
    const { reqId } = req.params
    const data = await service.getPipeline(reqId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function moveEntry(req: Request, res: Response) {
  try {
    const { reqId, entryId } = req.params
    const { stage_id } = req.body
    const entry = await service.moveEntry(reqId as string, entryId as string, stage_id)
    res.json(entry)
  } catch (err) { handleError(res, err) }
}

export async function shortlistEntry(req: Request, res: Response) {
  try {
    const { reqId, entryId } = req.params
    const { recruiter_notes } = req.body
    const entry = await service.shortlistEntry(reqId as string, entryId as string, recruiter_notes)
    res.json(entry)
  } catch (err) { handleError(res, err) }
}

export async function rejectEntry(req: Request, res: Response) {
  try {
    const { reqId, entryId } = req.params
    const { recruiter_notes } = req.body
    const entry = await service.rejectEntry(reqId as string, entryId as string, recruiter_notes)
    res.json(entry)
  } catch (err) { handleError(res, err) }
}

export async function updateNotes(req: Request, res: Response) {
  try {
    const { entryId } = req.params
    const { recruiter_notes } = req.body
    const entry = await service.updateNotes(entryId as string, recruiter_notes)
    res.json(entry)
  } catch (err) { handleError(res, err) }
}

export async function getCandidateView(req: Request, res: Response) {
  try {
    const { candidateId } = req.params
    const profile = await profileService.getProfile(Number(candidateId))
    res.json(profile)
  } catch (err) { handleError(res, err) }
}
