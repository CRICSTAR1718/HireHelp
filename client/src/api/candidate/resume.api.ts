import api from "./api";
import type { Resume, ResumeAnalytics } from "../../types/candidate";

interface ResumeApiRecord {
    id: number;
    candidateId: number;
    originalFileName: string;
    s3Url: string;
    createdAt: string;
}

function toResume(record: ResumeApiRecord): Resume {
    return {
        id: String(record.id),
        userId: String(record.candidateId),
        fileName: record.originalFileName,
        fileUrl: record.s3Url,
        uploadedAt: record.createdAt,
    };
}

export async function getResume(): Promise<Resume> {
    // The endpoint returns all active resumes. Use the newest one as the
    // candidate's current resume for profile and application flows.
    const response = await api.get<ResumeApiRecord[]>("/resumes");
    const latestResume = response.data
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (!latestResume) {
        throw new Error("No active resume found");
    }

    return toResume(latestResume);
}

export async function uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post<ResumeApiRecord>("/resumes/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return toResume(response.data);
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
