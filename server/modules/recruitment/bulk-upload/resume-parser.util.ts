import { randomUUID } from 'crypto';

export interface CandidateHints {
  firstName: string;
  lastName: string;
  email: string | null;
}

/**
 * Extract candidate name and email hints from a resume file.
 * Uses filename as a fallback for name extraction since we don't have
 * a proper PDF/DOCX parser in the dependencies. Email extraction uses
 * simple regex on the filename as a best-effort approach.
 * 
 * @param fileBuffer - Buffer containing the file data (not used in current implementation)
 * @param originalFileName - Original filename from the upload
 * @returns Object with firstName, lastName, and email (or null if not found)
 */
export function extractCandidateHints(fileBuffer: Buffer, originalFileName: string): CandidateHints {
  // Remove file extension
  const nameWithoutExt = originalFileName.replace(/\.(pdf|docx|doc)$/i, '');
  
  // Clean up common resume/cv suffixes and separators
  const cleanName = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b(resume|cv|curriculum vitae)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Extract email using regex from filename (best effort)
  const emailRegex = /[\w.+-]+@[\w-]+\.[\w.-]+/;
  const emailMatch = cleanName.match(emailRegex);
  let email: string | null = emailMatch ? emailMatch[0] : null;
  
  // Remove email from the name string if found
  const nameWithoutEmail = email ? cleanName.replace(emailRegex, '').trim() : cleanName;
  
  // Split name into first and last name
  const nameParts = nameWithoutEmail.split(' ').filter(part => part.length > 0);
  
  let firstName = 'Unknown';
  let lastName = 'Candidate';
  
  if (nameParts.length >= 2) {
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(' ');
  } else if (nameParts.length === 1) {
    firstName = nameParts[0];
  }
  
  // Title case the names
  firstName = toTitleCase(firstName);
  lastName = toTitleCase(lastName);
  
  return {
    firstName,
    lastName,
    email,
  };
}

/**
 * Generate a placeholder email for candidates where email extraction failed.
 * Uses the candidate's UUID to ensure uniqueness.
 */
export function generatePlaceholderEmail(candidateUuid: string): string {
  return `sourced-${candidateUuid}@unclaimed.hirehelp`;
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
