import { db } from '../../../database'
import { job_requisitions, applications, feedback_aggregations } from '../../../database/schema'
import { candidates, resumes } from '../../../database/schema/candidate.schema'
import { eq, desc } from 'drizzle-orm'
import { sendTalentPoolNotification } from '../../../common/utils/email.service'
import { env } from '../../../config/env'
import * as talentPoolRepo from './talent-pool.repository'
import * as applicationsRepo from '../applications/applications.repository'

export async function notifyTalentPool(jobId: string) {
  console.log(`🚀 Starting Talent Pool notification for job: ${jobId}`)

  try {
    // Get job requisition details
    const [requisition] = await db.select({
      id: job_requisitions.id,
      title: job_requisitions.title,
      department: job_requisitions.department,
      location: job_requisitions.location,
      employment_type: job_requisitions.employment_type
    })
    .from(job_requisitions)
    .where(eq(job_requisitions.id, jobId))
    .limit(1)

    if (!requisition) {
      console.error(`Job requisition not found: ${jobId}`)
      throw Object.assign(new Error('Job requisition not found'), { statusCode: 404 })
    }

    console.log(`📋 Job details:`, JSON.stringify(requisition, null, 2))

    // Get all active Talent Pool candidates
    const talentPoolCandidates = await talentPoolRepo.getTalentPoolCandidates()
    console.log(`👥 Found ${talentPoolCandidates.length} candidates in Talent Pool`)

    console.log("Talent Pool candidates:", talentPoolCandidates);

    if (talentPoolCandidates.length === 0) {
      console.log(`ℹ️ No candidates in Talent Pool to notify`)
      return { notified: 0, failed: 0 }
    }

    let notifiedCount = 0
    let failedCount = 0

    // Generate job URL for the candidate portal route
    const jobUrl = `${env.CLIENT_ORIGIN}/candidate/jobs/${requisition.id}`

    // Send notification to each candidate
    for (const candidate of talentPoolCandidates) {
      try {
        // Get candidate details
        console.log("Processing candidate:", candidate);
        const [candidateDetails] = await db.select({
          email: candidates.email,
          firstName: candidates.firstName,
          lastName: candidates.lastName
        })
        .from(candidates)
        .where(eq(candidates.uuid, candidate.candidate_id))
        .limit(1)

        if (!candidateDetails) {
          console.log("Candidate details:", candidateDetails);
          console.warn(`Candidate details not found for: ${candidate.candidate_id}`)
          failedCount++
          continue
        }

        const candidateName = `${candidateDetails.firstName} ${candidateDetails.lastName}`


        // Send email notification

        console.log("About to send Talent Pool email to:", candidateDetails.email);

        await sendTalentPoolNotification({
          to: candidateDetails.email,
          candidateName,
          jobTitle: requisition.title,
          department: requisition.department || 'Not specified',
          location: requisition.location || 'Not specified',
          employmentType: requisition.employment_type || 'Not specified',
          jobUrl
        })

        // Create notification history record
        await talentPoolRepo.createNotificationHistory({
          candidate_id: candidate.candidate_id,
          job_id: jobId,
          email_status: 'sent'
        })

        notifiedCount++
        console.log(`✅ Notification sent to: ${candidateDetails.email}`)
      } catch (error) {
        console.error(`❌ Failed to send notification to candidate ${candidate.candidate_id}:`, error)
        
        // Create notification history record with failed status
        await talentPoolRepo.createNotificationHistory({
          candidate_id: candidate.candidate_id,
          job_id: jobId,
          email_status: 'failed'
        })
        
        failedCount++
      }
    }

    console.log(`📊 Talent Pool notification complete: ${notifiedCount} sent, ${failedCount} failed`)
    return { notified: notifiedCount, failed: failedCount }
  } catch (error) {
    console.error('❌ Talent Pool notification workflow failed:', error)
    throw error
  }
}

export async function getTalentPoolCandidates() {
  const talentPoolEntries = await talentPoolRepo.getTalentPoolCandidates()
  
  // Enrich with candidate details
  const enrichedCandidates = await Promise.all(talentPoolEntries.map(async (entry) => {
    const [candidate] = await db.select({
      id: candidates.id,
      uuid: candidates.uuid,
      email: candidates.email,
      firstName: candidates.firstName,
      lastName: candidates.lastName,
      phone: candidates.phone
    })
    .from(candidates)
    .where(eq(candidates.uuid, entry.candidate_id))
    .limit(1)

    const [job] = await db.select({
      title: job_requisitions.title,
      department: job_requisitions.department,
      location: job_requisitions.location,
      employment_type: job_requisitions.employment_type
    })
    .from(job_requisitions)
    .where(eq(job_requisitions.id, entry.previous_job_id))
    .limit(1)

    let resumeUrl: string | undefined
    let resumeFileName: string | undefined
    if (entry.resume_id) {
      const [resume] = await db.select({
        s3Url: resumes.s3Url,
        originalFileName: resumes.originalFileName
      })
      .from(resumes)
      .where(eq(resumes.id, entry.resume_id))
      .limit(1)
      resumeUrl = resume?.s3Url
      resumeFileName = resume?.originalFileName
    }

    return {
      ...entry,
      candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown',
      candidateUuid: candidate?.uuid,
      email: candidate?.email,
      phone: candidate?.phone,
      previousJobTitle: job?.title,
      previousJobDepartment: job?.department,
      previousJobLocation: job?.location,
      employmentType: job?.employment_type,
      resumeUrl,
      resumeFileName
    }
  }))

  return enrichedCandidates
}

export async function getTalentPoolCandidate(id: string) {
  const entries = await getTalentPoolCandidates()
  const entry = entries.find((item) => item.id === id)

  if (!entry) {
    throw Object.assign(new Error('Candidate not found in Talent Pool'), { statusCode: 404 })
  }

  return entry
}

export async function removeCandidateFromTalentPool(id: string) {
  const removed = await talentPoolRepo.removeFromTalentPool(id)
  if (!removed) {
    throw Object.assign(new Error('Talent Pool entry not found'), { statusCode: 404 })
  }
  return removed
}

export async function getTalentPoolStats() {
  const totalCount = await talentPoolRepo.getActiveTalentPoolCount()
  const candidates = await talentPoolRepo.getTalentPoolCandidates()
  
  return {
    total: totalCount,
    candidates: candidates.length
  }
}

export async function applyForJobFromTalentPool(candidateId: string, jobId: string) {
  console.log(`🚀 Talent Pool candidate ${candidateId} applying for job ${jobId}`)
  
  try {
    // Check if candidate is in Talent Pool
    const talentPoolEntry = await talentPoolRepo.checkCandidateInTalentPool(candidateId)
    if (!talentPoolEntry) {
      throw Object.assign(new Error('Candidate not found in Talent Pool'), { statusCode: 404 })
    }

    // Check if already applied for this job
    const existingApplication = await applicationsRepo.findByCandidateAndJob(candidateId, jobId)
    if (existingApplication) {
      throw Object.assign(new Error('Already applied for this job'), { statusCode: 409 })
    }

    // Get candidate's resume ID from Talent Pool entry
    const resumeId = talentPoolEntry.resume_id
    if (!resumeId) {
      throw Object.assign(new Error('No resume found for this candidate'), { statusCode: 400 })
    }

    // Create application using existing resume
    const application = await applicationsRepo.createApplication({
      requisition_id: jobId,
      candidate_id: candidateId
    })

    console.log(`✅ Application created for Talent Pool candidate: ${application.id}`)

    // Trigger AI evaluation with existing resume by calling recalculateFitment
    const { recalculateFitment } = await import('../applications/applications.service')
    recalculateFitment(application.id, jobId).catch((error: Error) => {
      console.error('AI evaluation failed for Talent Pool application:', error)
    })

    return application
  } catch (error) {
    console.error('Failed to apply from Talent Pool:', error)
    throw error
  }
}

export async function archiveRejectedApplicationToTalentPool(applicationId: string, rejectionReason?: string) {
  const [application] = await db.select({
    id: applications.id,
    requisition_id: applications.requisition_id,
    candidate_id: applications.candidate_id,
    ai_score: applications.ai_score
  })
  .from(applications)
  .where(eq(applications.id, applicationId))
  .limit(1)

  if (!application) {
    throw Object.assign(new Error('Application not found'), { statusCode: 404 })
  }

  const existingInPool = await talentPoolRepo.checkCandidateInTalentPool(application.candidate_id as string)
  if (existingInPool) {
    return existingInPool
  }

  const [candidate] = await db.select({
    id: candidates.id,
    uuid: candidates.uuid,
    email: candidates.email,
    firstName: candidates.firstName,
    lastName: candidates.lastName,
    phone: candidates.phone
  })
  .from(candidates)
  .where(eq(candidates.uuid, application.candidate_id as string))
  .limit(1)

  if (!candidate) {
    throw Object.assign(new Error('Candidate not found'), { statusCode: 404 })
  }

  const [resume] = await db.select({
    id: resumes.id
  })
  .from(resumes)
  .where(eq(resumes.candidateId, candidate.id))
  .orderBy(desc(resumes.createdAt))
  .limit(1)

  const [feedback] = await db.select({
    overall_rating: feedback_aggregations.overall_rating,
    raw_feedback: feedback_aggregations.raw_feedback
  })
  .from(feedback_aggregations)
  .where(eq(feedback_aggregations.application_id, applicationId))
  .orderBy(desc(feedback_aggregations.aggregated_at))
  .limit(1)

  return talentPoolRepo.addToTalentPool({
    candidate_id: candidate.uuid,
    resume_id: resume?.id,
    previous_job_id: application.requisition_id,
    application_id: application.id,
    interview_feedback: feedback?.raw_feedback ? JSON.stringify(feedback.raw_feedback) : undefined,
    interview_score: feedback?.overall_rating ? parseFloat(feedback.overall_rating.toString()) : undefined,
    ai_score: application.ai_score ? parseFloat(application.ai_score.toString()) : undefined,
    rejection_reason: rejectionReason || 'Application rejected after interview process'
  })
}

export async function checkCandidateInTalentPool(candidateId: string) {
  return await talentPoolRepo.checkCandidateInTalentPool(candidateId)
}
