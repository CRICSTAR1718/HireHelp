import api from "./api";
import type { Job } from "../../types/candidate";

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
