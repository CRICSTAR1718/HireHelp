import { db } from '../../../database';
import { candidates } from '../../../database/schema/candidate.schema';
import { eq } from 'drizzle-orm';
import { NewCandidate } from '../../../database/schema/candidate.schema';
import { resumeRepository } from '../../candidates/resume/resume.repository';

export interface CreateSourcedCandidateInput {
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  source: 'sourced';
  isClaimed: false;
  sourcedByUserId: number;
  passwordHash?: null;
}

export class BulkUploadRepository {
  async findCandidateByEmail(email: string) {
    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.email, email))
      .limit(1);
    return candidate || null;
  }

  async createSourcedCandidate(data: CreateSourcedCandidateInput) {
    const [candidate] = await db
      .insert(candidates)
      .values({
        ...data,
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as NewCandidate)
      .returning();
    return candidate;
  }

  async createResume(candidateId: number, file: Express.Multer.File) {
    // Cloudinary returns the URL in file.path after upload via multer-storage-cloudinary
    const cloudinaryUrl = file.path;
    
    return resumeRepository.create({
      candidateId,
      originalFileName: file.originalname,
      s3Key: cloudinaryUrl,
      s3Url: cloudinaryUrl,
      fileSize: file.size,
      fileType: file.mimetype,
    });
  }
}

export const bulkUploadRepository = new BulkUploadRepository();
