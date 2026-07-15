import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { resumeRepository } from './resume.repository.js';
import { publishEvent } from '../../../events/bus';
import { events } from '../../../events/catalog';
import { randomUUID } from 'crypto';


const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true,
});

export class ResumeService {
  async upload(candidateId: number, file: any) {
    const key = `resumes/${candidateId}/${randomUUID()}-${file.originalname}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const s3Url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
    
    const resume = await resumeRepository.create({
      candidateId,
      originalFileName: file.originalname,
      s3Key: key,
      s3Url,
      fileSize: file.size,
      fileType: file.mimetype,
    });

    // ENABLED — was commented out (dead code) in the original repo, meaning
    // ai-evaluation-service never actually got notified of new resumes via
    // this path. Now wired to the shared bus.
    await publishEvent(events.ResumeUploaded, {
      candidateId,
      resumeId: resume.id,
      s3Key: key,
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
