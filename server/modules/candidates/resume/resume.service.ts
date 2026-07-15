import { resumeRepository } from './resume.repository.js';
import { publishEvent } from '../../../events/bus';
import { events } from '../../../events/catalog';

export class ResumeService {
  async upload(candidateId: number, file: any) {
    // Cloudinary returns the URL in file.path after upload via multer-storage-cloudinary
    const cloudinaryUrl = file.path;
    
    const resume = await resumeRepository.create({
      candidateId,
      originalFileName: file.originalname,
      s3Key: cloudinaryUrl, // Reusing s3Key column for Cloudinary URL (no schema changes)
      s3Url: cloudinaryUrl, // Reusing s3Url column for Cloudinary URL (no schema changes)
      fileSize: file.size,
      fileType: file.mimetype,
    });

    // ENABLED — was commented out (dead code) in the original repo, meaning
    // ai-evaluation-service never actually got notified of new resumes via
    // this path. Now wired to the shared bus.
    await publishEvent(events.ResumeUploaded, {
      candidateId,
      resumeId: resume.id,
      s3Key: cloudinaryUrl, // Reusing s3Key for Cloudinary URL
      originalFileName: file.originalname,
    });

    return resume;
  }

  async list(candidateId: number) {
    return await resumeRepository.findByCandidateId(candidateId);
  }

  async delete(id: number, candidateId: number) {
    await resumeRepository.deactivate(id, candidateId);
  }
}

export const resumeService = new ResumeService();
