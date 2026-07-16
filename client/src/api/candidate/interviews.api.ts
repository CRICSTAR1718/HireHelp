import api from "./api";
import type { Interview, InterviewStats } from "../../types/candidate";

export async function getInterviews(): Promise<Interview[]> {
    const response = await api.get<Interview[]>("/interview-status");
    return response.data;
}

export async function getUpcomingInterviews(candidateId: string): Promise<any[]> {
    const response = await api.get<any[]>(`/interviews/scheduling/upcoming/${candidateId}`);
    return response.data;
}

export async function getInterviewStats(): Promise<InterviewStats> {
    // TODO(backend): no /candidates/interview-status/stats route exists on
    // the merged server yet (module only has list / getById / update).
    // Failing soft so the page renders instead of crashing on this widget.
    try {
        const response = await api.get<InterviewStats>("/interview-status/stats");
        return response.data;
    } catch {
        return { scheduled: 0, completed: 0, offers: 0 };
    }
}
