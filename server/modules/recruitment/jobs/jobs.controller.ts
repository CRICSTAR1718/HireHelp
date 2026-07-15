import { Request, Response } from 'express'
import * as service from './jobs.service'
import * as formsService from '../forms/forms.service'

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    const code = (err as any).statusCode ?? 500
    return res.status(code).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

export async function listJobs(req: Request, res: Response) {
  try {
    const jobs = await service.listPublishedJobs()
    res.json(jobs)
  } catch (err) { handleError(res, err) }
}

export async function getJob(req: Request, res: Response) {
  try {
    const job = await service.getJobDetails(req.params.id as string)
    res.json(job)
  } catch (err) { handleError(res, err) }
}

export async function getJobForm(req: Request, res: Response) {
  try {
    const form = await formsService.getForm(req.params.id as string)
    if (!form.is_published) {
      return res.status(404).json({ error: 'Form not found or not published' })
    }
    res.json(form)
  } catch (err) { handleError(res, err) }
}
