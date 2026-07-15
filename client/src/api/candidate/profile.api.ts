import api from "./api";
import type { Profile } from "../../types/candidate";

function normalizeProfile(payload: any): Profile {
    const profile = payload?.profile ?? payload ?? {};
    const socialLinks = payload?.socialLinks ?? {};

    return {
        id: String(profile.id ?? payload?.id ?? ""),
        userId: String(profile.userId ?? payload?.userId ?? ""),
        fullName: profile.fullName ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        location: profile.location ?? "",
        headline: profile.headline ?? "",
        summary: profile.summary ?? "",
        portfolio: profile.portfolio ?? socialLinks.website ?? socialLinks.portfolio ?? "",
        linkedin: profile.linkedin ?? socialLinks.linkedin ?? "",
        github: profile.github ?? socialLinks.github ?? "",
        profilePictureUrl: profile.profilePictureUrl ?? payload?.profileImage ?? "",
        skills: Array.isArray(payload?.skills) ? payload.skills : profile.skills ?? [],
        education: Array.isArray(payload?.education) ? payload.education : profile.education ?? [],
        experience: Array.isArray(payload?.experience) ? payload.experience : profile.experience ?? [],
        resume: payload?.resume ?? profile.resume ?? null,
    };
}

export async function getProfile(): Promise<Profile> {
    const response = await api.get<any>("/profile");
    return normalizeProfile(response.data);
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
    const response = await api.put<any>("/profile", data);
    return normalizeProfile(response.data);
}

export async function uploadProfilePicture(file: File): Promise<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ profilePictureUrl?: string; profileImage?: string }>('/profile/profile-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return {
        profilePictureUrl: response.data.profilePictureUrl ?? response.data.profileImage ?? "",
    };
}
