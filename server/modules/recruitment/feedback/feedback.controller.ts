import { Request, Response } from 'express'
import * as service from './feedback.service'

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    const code = (err as any).statusCode ?? 500
    return res.status(code).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

export async function getFeedback(req: Request, res: Response) {
  try {
    const data = await service.getFeedbackForApplication(req.params.applicationId as string)
    res.json(data)
  } catch (err) { handleError(res, err) }
}
