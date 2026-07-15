import api from "./api";
import type { Job, ApplicationForm } from "../../types/candidate";

export async function getJobs(search?: string): Promise<Job[]> {
    const response = await api.get<Job[]>("/jobs", {
        params: search ? { search } : undefined,
    });
    return response.data;
}

export async function getJob(id: string): Promise<Job> {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
}

export async function getJobForm(requisitionId: string): Promise<ApplicationForm> {
    const response = await api.get<ApplicationForm>(`/jobs/${requisitionId}/form`);
    return response.data;
}
