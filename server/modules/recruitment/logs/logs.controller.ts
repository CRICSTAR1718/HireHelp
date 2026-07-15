import { Request, Response } from 'express'
import * as service from './logs.service'

function handleError(res: Response, err: unknown) {
  return res.status(500).json({ error: 'Internal server error' })
}

export async function getStatusLogs(req: Request, res: Response) {
  try {
    const data = await service.getStatusLogs(req.params.requisitionId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}
