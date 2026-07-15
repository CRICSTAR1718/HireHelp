import api from "./index"

export interface CreateOfferPayload {
  requisition_id: string
  application_id: string
  candidate_id: string
  title: string
  department?: string
  salary_amount: number
  salary_currency?: string
  start_date: string
  expires_at?: string
}

export const createOffer = async (payload: CreateOfferPayload) => {
  const res = await api.post('/offers', payload)
  return res.data
}

export const getOffer = async (id: string) => {
  const res = await api.get(`/offers/${id}`)
  return res.data
}

export const getOffersForApplication = async (applicationId: string) => {
  const res = await api.get(`/offers/application/${applicationId}`)
  return res.data
}
