import api from "./api";
import type { Application } from "../../types/candidate";

export async function getApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>("/applications");
    return response.data;
}

export async function applyToJob(jobId: string): Promise<Application> {
    const response = await api.post<Application>("/applications", { jobId });
    return response.data;
}
