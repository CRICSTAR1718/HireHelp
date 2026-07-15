import api from "./api";
import type { Profile } from "../../types/candidate";

export async function getProfile(): Promise<Profile> {
    const response = await api.get<Profile>("/profile");
    return response.data;
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
    const response = await api.put<Profile>("/profile", data);
    return response.data;
}
