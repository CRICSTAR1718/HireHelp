export interface Job {
    id: string;
    company: string;
    role: string;
    location: string;
    type: string;
    description?: string;
    salary?: string;
    postedDate?: string;
}

export interface Application {
    id: string;
    userId: string;
    jobId: string;
    company: string;
    role: string;
    location: string;
    appliedDate: string;
    status: "Applied" | "Interview" | "Rejected" | "Offer";
}

export interface Interview {
    id: string;
    userId: string;
    company: string;
    role: string;
    interviewer: string;
    date: string;
    time: string;
    meetingLink: string;
    status: "Scheduled" | "Completed" | "Cancelled";
    formattedDate?: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    time: string;
    type: "job" | "interview" | "profile";
    unread: boolean;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface Profile {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    headline?: string;
    summary?: string;
    skills: string[];
    education: Education[];
    experience: Experience[];
}

export interface Resume {
    id: string;
    userId: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
    score?: number;
}

export interface ResumeAnalytics {
    score: number;
    keywordsMatched: number;
    keywordsMissing: number;
    sections: { name: string; score: number }[];
    suggestions: string[];
}

export interface DashboardData {
    stats: {
        totalApplications: number;
        resumeScore: number;
        interviewsScheduled: number;
        unreadNotifications: number;
    };
    profileCompletion: number;
    upcomingInterview: Interview | null;
    resumeStatus: {
        uploaded: boolean;
        score: number;
        fileName: string | null;
        lastUpdated: string | null;
    };
    recentApplications: Application[];
    recommendedJobs: { id: string; title: string; company: string }[];

    activityTimeline: string[];
    notifications: string[];

}

export interface InterviewStats {
    scheduled: number;
    completed: number;
    offers: number;
}

export interface NotificationStats {
    total: number;
    unread: number;
    interviews: number;
    applications: number;
}
