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
    const data = await service.listApplications(req.params.reqId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function getApplication(req: Request, res: Response) {
  try {
    const data = await service.getApplication(req.params.aid as string, req.params.reqId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const data = await service.updateStatus(req.params.aid as string, req.params.reqId as string, req.body.status)
    res.json(data)
  } catch (err) { handleError(res, err) }
}
