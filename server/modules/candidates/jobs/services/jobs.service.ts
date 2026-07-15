// ─────────────────────────────────────────────────────────────────────────────
// CHANGED FROM ORIGINAL: this file used to return a hardcoded array of 5 fake
// jobs (Google/Meta/Amazon/etc.) — it was never actually wired to
// recruitment-service's real job listings, presumably a placeholder from
// early development. Now that both modules are in-process, it calls
// recruitment's real `getPublishedJobs()` query directly instead of an HTTP
// call (which is what this would have needed if it were ever finished as a
// cross-service call) or continuing to fake it.
//
// NOTE: an earlier bulk find/replace pass during the merge accidentally
// corrupted description strings in the old mock data (e.g. "web
// applications" became "web candidateApplications") — moot now since the
// mock data is gone entirely, but flagging in case this file's git history
// is reviewed and that diff looks strange.
// ─────────────────────────────────────────────────────────────────────────────

import { getPublishedJobs } from '../../../recruitment/jobs/jobs.repository';

export async function getAllJobs() {
  return getPublishedJobs();
}

export async function getJobById(id: string) {
  const jobs = await getPublishedJobs();
  return jobs.find((job: { id: string }) => job.id === id) ?? null;
}

export async function searchJobs(query: string) {
  const jobs = await getPublishedJobs();
  const lowerQuery = query.toLowerCase();
  return jobs.filter(
    (job: { title: string; department?: string | null; location?: string | null }) =>
      job.title.toLowerCase().includes(lowerQuery) ||
      (job.department ?? '').toLowerCase().includes(lowerQuery) ||
      (job.location ?? '').toLowerCase().includes(lowerQuery)
  );
}
