import * as repo from './pipeline.repository'
import { publishEvent } from '../../../events/bus'

export async function getPipeline(requisitionId: string) {
  const stages = await repo.ensurePipelineStages(requisitionId)
  const entries = await repo.getEntries(requisitionId)

  // Group entries by stage for kanban view
  const board = stages.map(stage => ({
    ...stage,
    entries: entries.filter(e => e.stage_id === stage.id)
  }))

  return { stages, entries, board }
}

export async function moveEntry(requisitionId: string, entryId: string, stageId: string) {
  // Validate stage belongs to this requisition
  const stage = await repo.findStageById(stageId, requisitionId)
  if (!stage) {
    throw Object.assign(new Error('Stage not found for this requisition'), { statusCode: 404 })
  }

  const entry = await repo.findEntry(entryId)
  if (!entry) throw Object.assign(new Error('Pipeline entry not found'), { statusCode: 404 })

  return repo.moveEntry(entryId, stageId)
}

export async function shortlistEntry(requisitionId: string, entryId: string, notes?: string) {
  const entry = await repo.findEntry(entryId)
  if (!entry) throw Object.assign(new Error('Pipeline entry not found'), { statusCode: 404 })
  if (entry.requisition_id !== requisitionId) {
    throw Object.assign(new Error('Entry does not belong to this requisition'), { statusCode: 403 })
  }

  const updated = await repo.setEntryStatus(entryId, 'shortlisted', notes)

  // Emit Kafka event
  await publishEvent('CandidateShortlisted', {
    requisitionId,
    applicationId: entry.application_id,
    candidateId: entry.candidate_id,
    entryId
  })

  return updated
}

export async function rejectEntry(requisitionId: string, entryId: string, notes?: string) {
  const entry = await repo.findEntry(entryId)
  if (!entry) throw Object.assign(new Error('Pipeline entry not found'), { statusCode: 404 })
  if (entry.requisition_id !== requisitionId) {
    throw Object.assign(new Error('Entry does not belong to this requisition'), { statusCode: 403 })
  }

  return repo.setEntryStatus(entryId, 'rejected', notes)
}

export async function updateNotes(entryId: string, notes: string) {
  const entry = await repo.findEntry(entryId)
  if (!entry) throw Object.assign(new Error('Pipeline entry not found'), { statusCode: 404 })
  return repo.updateNotes(entryId, notes)
}

export async function addApplicationToPipeline(
  requisitionId: string,
  applicationId: string,
  candidateId: string
) {
  const stages = await repo.ensurePipelineStages(requisitionId)
  const firstStage = stages[0]
  if (!firstStage) throw new Error('No pipeline stages found')

  return repo.createEntry({
    requisition_id: requisitionId,
    application_id: applicationId,
    stage_id: firstStage.id,
    candidate_id: candidateId
  })
}
