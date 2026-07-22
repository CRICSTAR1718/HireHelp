import 'dotenv/config';
import { db } from '../database/index';
import { candidates, resumes } from '../database/schema/candidate.schema';
import { eq, and } from 'drizzle-orm';

async function getCandidateResume() {
  try {
    // Search for candidate with name containing "aryan"
    const candidateResults = await db
      .select({
        id: candidates.id,
        uuid: candidates.uuid,
        firstName: candidates.firstName,
        lastName: candidates.lastName,
        email: candidates.email,
      })
      .from(candidates)
      .where(eq(candidates.firstName, 'Aryan'));

    console.log('Found candidates:', candidateResults.length);

    if (candidateResults.length === 0) {
      console.log('No candidate named "Aryan" found');
      return;
    }

    for (const candidate of candidateResults) {
      console.log(`\nCandidate: ${candidate.firstName} ${candidate.lastName}`);
      console.log(`Email: ${candidate.email}`);
      console.log(`ID: ${candidate.id}, UUID: ${candidate.uuid}`);

      // Get resumes for this candidate
      const candidateResumes = await db
        .select({
          id: resumes.id,
          originalFileName: resumes.originalFileName,
          s3Url: resumes.s3Url,
          s3Key: resumes.s3Key,
          fileSize: resumes.fileSize,
          fileType: resumes.fileType,
          createdAt: resumes.createdAt,
        })
        .from(resumes)
        .where(and(eq(resumes.candidateId, candidate.id), eq(resumes.isActive, true)))
        .orderBy(resumes.createdAt);

      if (candidateResumes.length === 0) {
        console.log('  No active resumes found');
      } else {
        console.log(`  Found ${candidateResumes.length} resume(s):`);
        candidateResumes.forEach((resume, idx) => {
          console.log(`  [${idx + 1}] ${resume.originalFileName}`);
          console.log(`      S3 URL: ${resume.s3Url}`);
          console.log(`      File Size: ${resume.fileSize} bytes`);
          console.log(`      File Type: ${resume.fileType}`);
          console.log(`      Uploaded: ${resume.createdAt}`);
        });
      }
    }
  } catch (error) {
    console.error('Error fetching candidate resume:', error);
    process.exit(1);
  }
}

getCandidateResume()
  .then(() => {
    console.log('\nDone');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
  });
