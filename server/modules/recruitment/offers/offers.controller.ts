import { Request, Response } from 'express'
import * as service from './offers.service'

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    const code = (err as any).statusCode ?? 500
    return res.status(code).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}

export async function createOffer(req: Request, res: Response) {
  try {
    const offer = await service.createOffer(req.body, req.user!.userId)
    res.status(201).json(offer)
  } catch (err) { handleError(res, err) }
}

export async function getOffer(req: Request, res: Response) {
  try {
    const offer = await service.getOffer(req.params.id as string)
    res.json(offer)
  } catch (err) { handleError(res, err) }
}

export async function getOffersForApplication(req: Request, res: Response) {
  try {
    const offers = await service.getOffersForApplication(req.params.applicationId as string)
    res.json(offers)
  } catch (err) { handleError(res, err) }
}
