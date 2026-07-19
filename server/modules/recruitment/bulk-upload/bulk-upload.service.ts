import { bulkUploadRepository } from './bulk-upload.repository';
import { extractCandidateHints, generatePlaceholderEmail } from './resume-parser.util';
import { submitApplication } from '../applications/applications.service';
import { findOne } from '../requisitions/requisitions.repository';
import { randomUUID } from 'crypto';

export interface BulkUploadResult {
  fileName: string;
  status: 'success' | 'failed';
  candidateId?: number;
  candidateUuid?: string;
  applicationId?: string;
  error?: string;
}

export interface BulkUploadSummary {
  total: number;
  succeeded: number;
  failed: number;
  results: BulkUploadResult[];
}

export class BulkUploadService {
  async bulkUploadResumes(
    requisitionId: string,
    files: Express.Multer.File[],
    uploadedByUserId: number
  ): Promise<BulkUploadSummary> {
    // Validate requisition exists first
    const requisition = await findOne(requisitionId);
    if (!requisition) {
      throw Object.assign(new Error('Requisition not found'), { statusCode: 404 });
    }

    const results: BulkUploadResult[] = [];
    let succeeded = 0;
    let failed = 0;

    for (const file of files) {
      try {
        const result = await this.processSingleFile(
          file,
          requisitionId,
          uploadedByUserId
        );
        results.push(result);
        if (result.status === 'success') {
          succeeded++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        results.push({
          fileName: file.originalname,
          status: 'failed',
          error: (error as Error).message,
        });
      }
    }

    return {
      total: files.length,
      succeeded,
      failed,
      results,
    };
  }

  private async processSingleFile(
    file: Express.Multer.File,
    requisitionId: string,
    uploadedByUserId: number
  ): Promise<BulkUploadResult> {
    // Extract candidate hints from filename
    const hints = extractCandidateHints(file.buffer, file.originalname);

    // Generate UUID for candidate
    const candidateUuid = randomUUID();

    // Determine email (use extracted or placeholder)
    let email = hints.email;
    if (!email) {
      email = generatePlaceholderEmail(candidateUuid);
    }

    // Check if candidate with email already exists
    const existingCandidate = await bulkUploadRepository.findCandidateByEmail(email);
    let candidateId: number;
    let finalCandidateUuid: string;

    if (existingCandidate) {
      // Use existing candidate
      candidateId = existingCandidate.id;
      finalCandidateUuid = existingCandidate.uuid;
    } else {
      // Create new sourced candidate
      const newCandidate = await bulkUploadRepository.createSourcedCandidate({
        uuid: candidateUuid,
        email,
        firstName: hints.firstName,
        lastName: hints.lastName,
        source: 'sourced',
        isClaimed: false,
        sourcedByUserId: uploadedByUserId,
        passwordHash: null,
      });
      candidateId = newCandidate.id;
      finalCandidateUuid = newCandidate.uuid;
    }

    // Create resume record
    const resume = await bulkUploadRepository.createResume(candidateId, file);

    // Submit application (triggers AI evaluation)
    const application = await submitApplication(
      finalCandidateUuid,
      requisitionId,
      [], // No form responses for bulk uploaded candidates
      resume.id
    );

    return {
      fileName: file.originalname,
      status: 'success',
      candidateId,
      candidateUuid: finalCandidateUuid,
      applicationId: application.id,
    };
  }
}

export const bulkUploadService = new BulkUploadService();
