import api from "./api";
import type { Resume, ResumeAnalytics } from "../../types/candidate";

export async function getResume(): Promise<Resume> {
    const response = await api.get<Resume>("/resumes");
    return response.data;
}

export async function uploadResume(fileName: string): Promise<Resume> {
    const response = await api.post<Resume>("/resumes/upload", { fileName });
    return response.data;
}

export async function getResumeAnalytics(): Promise<ResumeAnalytics> {
    // TODO(backend): no /candidates/resumes/analytics route exists yet on the
    // merged server (resume module only has upload/list/delete). Failing soft
    // here so the Resume page renders instead of crashing on this widget.
    try {
        const response = await api.get<ResumeAnalytics>("/resumes/analytics");
        return response.data;
    } catch {
        return { score: 0, keywordsMatched: 0, keywordsMissing: 0, sections: [], suggestions: [] };
    }
}
