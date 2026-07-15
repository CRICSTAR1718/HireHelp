import * as repo from './offers.repository'
import { publishEvent } from '../../../events/bus'

function generateOfferLetterHtml(data: any): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: data.salary_currency
  })

  return `
    <h2>Offer of Employment</h2>
    <p>Dear Candidate,</p>
    <p>We are pleased to offer you the position of <strong>${data.title}</strong> at HireHelp.</p>
    <p>Your compensation will be <strong>${formatter.format(data.salary_amount)}</strong> per annum.</p>
    <p>Your expected start date is <strong>${new Date(data.start_date).toLocaleDateString()}</strong>.</p>
    <br>
    <p>Best regards,</p>
    <p>The HireHelp Team</p>
  `
}

export async function createOffer(data: any, userId: string) {
  const letterHtml = generateOfferLetterHtml(data)
  
  const offerData = {
    ...data,
    start_date: new Date(data.start_date),
    expires_at: data.expires_at ? new Date(data.expires_at) : null,
    offered_by: userId,
    offer_letter: letterHtml,
    status: 'sent' as const
  }

  const offer = await repo.createOffer(offerData)

  // Emit Kafka event
  await publishEvent('OfferGenerated', {
    offerId: offer.id,
    requisitionId: offer.requisition_id,
    applicationId: offer.application_id,
    candidateId: offer.candidate_id,
    status: offer.status
  })

  return offer
}

export async function getOffer(id: string) {
  const offer = await repo.getOffer(id)
  if (!offer) {
    throw Object.assign(new Error('Offer not found'), { statusCode: 404 })
  }
  return offer
}

export async function getOffersForApplication(applicationId: string) {
  return repo.getOffersForApplication(applicationId)
}
