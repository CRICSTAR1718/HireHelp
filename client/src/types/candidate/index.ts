export interface Job {
    id: string;
    memo_no?: string;
    title: string;
    department?: string;
    team?: string;
    location?: string;
    employment_type?: string;
    work_mode?: string;
    number_of_openings?: number;
    about_role?: string;
    responsibilities?: string;
    required_skills?: string;
    preferred_skills?: string;
    experience_required?: string;
    education_requirements?: string;
    salary?: string;
    benefits?: string;
    hiring_manager?: string;
    hiring_manager_email?: string;
    application_deadline?: string;
    published_at?: string;
}

export interface Application {
    id: string;
    candidateId: number;
    jobId: string;
    jobTitle?: string;
    department?: string;
    company?: string;
    location?: string;
    appliedDate: string;
    status: "applied" | "under_review" | "shortlisted" | "rejected" | "hired" | "interview" | "offer";
    coverLetter?: string;
    fitmentScore?: number;
    recruiter?: string;
    interviewStatus?: string;
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

export interface FormField {
    id: string;
    label: string;
    field_type: 'text' | 'textarea' | 'dropdown' | 'file' | 'checkbox' | 'date' | 'number' | 'url' | 'multi_select' | 'rating' | 'yes_no' | 'email' | 'phone' | 'time' | 'radio';
    is_required: boolean;
    position: number;
    placeholder?: string;
    helper_text?: string;
    max_rating?: number;
    options?: FieldOption[];
}

export interface FieldOption {
    id: string;
    label: string;
    position: number;
}

export interface ApplicationForm {
    id: string;
    requisition_id: string;
    is_published: boolean;
    admin_remarks?: string;
    created_at: string;
    updated_at: string;
    fields: FormField[];
}

export interface FormResponse {
    field_id: string;
    response_text?: string;
    response_json?: any;
    file_url?: string;
}

export interface ApplicationSubmission {
    jobId: string;
    resumeId?: number;
    responses: FormResponse[];
}
