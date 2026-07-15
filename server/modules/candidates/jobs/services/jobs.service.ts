import * as jobsService from '../../../recruitment/jobs/jobs.service';
import * as formsService from '../../../recruitment/forms/forms.service';

export async function getAllJobs() {
  return jobsService.listPublishedJobs();
}

export async function getJobById(id: string) {
  return jobsService.getJobDetails(id);
}

export async function searchJobs(query: string) {
  const jobs = await getAllJobs();
  const lowerQuery = query.toLowerCase();
  return jobs.filter(
    (job: any) =>
      job.title?.toLowerCase().includes(lowerQuery) ||
      (job.department ?? '').toLowerCase().includes(lowerQuery) ||
      (job.location ?? '').toLowerCase().includes(lowerQuery)
  );
}

export async function getJobForm(requisitionId: string) {
  const form = await formsService.getForm(requisitionId);
  if (!form.is_published) {
    throw Object.assign(new Error('Form not found or not published'), { statusCode: 404 });
  }
  return form;
}
