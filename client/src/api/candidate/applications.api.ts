import api from "./api";
import axios from "axios";
import { TOKEN_KEY } from "../shared/client";
import type { Application, ApplicationSubmission } from "../../types/candidate";

// Create a separate API instance for recruitment endpoints (different base URL)
const recruitmentApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

recruitmentApi.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function getApplications(): Promise<Application[]> {
    const response = await recruitmentApi.get<Application[]>("/applications/candidate/my-applications");
    return response.data;
}

export async function submitApplication(data: ApplicationSubmission): Promise<any> {
    const response = await recruitmentApi.post("/applications/submit", data);
    return response.data;
}

export async function checkApplicationStatus(requisitionId: string): Promise<{ applied: boolean; status?: string }> {
    const response = await recruitmentApi.get<{ applied: boolean; status?: string }>(`/applications/check/${requisitionId}`);
    return response.data;
}
