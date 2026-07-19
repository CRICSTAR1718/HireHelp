import * as service from './talent-pool.service'

export async function getTalentPool(req: any, res: any) {
  try {
    const candidates = await service.getTalentPoolCandidates()
    res.json(candidates)
  } catch (error) {
    console.error('Error fetching Talent Pool:', error)
    res.status(500).json({ error: 'Failed to fetch Talent Pool candidates' })
  }
}

export async function getTalentPoolStats(req: any, res: any) {
  try {
    const stats = await service.getTalentPoolStats()
    res.json(stats)
  } catch (error) {
    console.error('Error fetching Talent Pool stats:', error)
    res.status(500).json({ error: 'Failed to fetch Talent Pool statistics' })
  }
}

export async function getTalentPoolCandidate(req: any, res: any) {
  try {
    const { id } = req.params
    const candidateData = await service.getTalentPoolCandidate(id)
    res.json(candidateData)
  } catch (error) {
    console.error('Error fetching Talent Pool candidate:', error)
    res.status((error as any)?.statusCode ?? 500).json({ error: (error as Error).message || 'Failed to fetch candidate' })
  }
}

export async function removeCandidate(req: any, res: any) {
  try {
    const { id } = req.params
    const removed = await service.removeCandidateFromTalentPool(id)
    res.json({ message: 'Candidate removed from Talent Pool', data: removed })
  } catch (error: any) {
    console.error('Error removing candidate from Talent Pool:', error)
    if (error.statusCode === 404) {
      return res.status(404).json({ error: error.message })
    }
    res.status(500).json({ error: 'Failed to remove candidate' })
  }
}

export async function downloadResume(req: any, res: any) {
  try {
    const { id } = req.params
    const candidate = await service.getTalentPoolCandidate(id)
    
    if (!candidate.resumeUrl) {
      return res.status(404).json({ error: 'Resume not found for this candidate' })
    }
    
    res.json({ resumeUrl: candidate.resumeUrl })
  } catch (error) {
    console.error('Error downloading resume:', error)
    res.status(500).json({ error: 'Failed to download resume' })
  }
}

export async function applyForJob(req: any, res: any) {
  try {
    const { candidateId, jobId } = req.params
    let resolvedCandidateId = candidateId
    
    // Verify the authenticated candidate matches the candidateId
    if (req.candidateUser?.id) {
      // For candidate authentication, verify they own this candidate ID
      const { candidates } = await import('../../../database/schema/candidate.schema')
      const { db } = await import('../../../database')
      const { eq } = await import('drizzle-orm')
      
      const [candidate] = await db.select({
        id: candidates.id,
        uuid: candidates.uuid
      })
      .from(candidates)
      .where(eq(candidates.id, req.candidateUser.id))
      .limit(1)
      
      if (!candidate || (candidate.uuid !== candidateId && candidate.id.toString() !== candidateId)) {
        return res.status(403).json({ error: 'Unauthorized: You can only apply for yourself' })
      }

      resolvedCandidateId = candidate.uuid
    }
    
    const application = await service.applyForJobFromTalentPool(resolvedCandidateId, jobId)
    res.json({ message: 'Application submitted successfully', application })
  } catch (error: any) {
    console.error('Error applying from Talent Pool:', error)
    if (error.statusCode === 404) {
      return res.status(404).json({ error: error.message })
    }
    if (error.statusCode === 409) {
      return res.status(409).json({ error: error.message })
    }
    if (error.statusCode === 400) {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Failed to submit application' })
  }
}

export async function checkCandidateInPool(req: any, res: any) {
  try {
    const { candidateId } = req.params
    let resolvedCandidateId = candidateId
    
    // Verify the authenticated candidate matches the candidateId
    if (req.candidateUser?.id) {
      const { candidates } = await import('../../../database/schema/candidate.schema')
      const { db } = await import('../../../database')
      const { eq } = await import('drizzle-orm')
      
      const [candidate] = await db.select({
        id: candidates.id,
        uuid: candidates.uuid
      })
      .from(candidates)
      .where(eq(candidates.id, req.candidateUser.id))
      .limit(1)
      
      if (!candidate || (candidate.uuid !== candidateId && candidate.id.toString() !== candidateId)) {
        return res.status(403).json({ error: 'Unauthorized' })
      }

      resolvedCandidateId = candidate.uuid
    }
    
    const inPool = await service.checkCandidateInTalentPool(resolvedCandidateId)
    res.json({ inPool: !!inPool })
  } catch (error) {
    console.error('Error checking Talent Pool status:', error)
    res.status(500).json({ error: 'Failed to check Talent Pool status' })
  }
}
