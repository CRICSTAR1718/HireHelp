import api from "./api";

export interface EmailPreferences {
  jobAlerts: boolean;
  applicationUpdates: boolean;
  interviewEmails: boolean;
  marketingEmails: boolean;
}

export interface PrivacySettings {
  profileVisibility: boolean;
  allowRecruiterDiscovery: boolean;
  includeInTalentPool: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function getSettings() {
  const response = await api.get("/settings");
  return response.data;
}

export async function updateEmailPreferences(preferences: EmailPreferences) {
  const response = await api.put("/settings/email-preferences", preferences);
  return response.data;
}

export async function updatePrivacySettings(settings: PrivacySettings) {
  const response = await api.put("/settings/privacy", settings);
  return response.data;
}

export async function changePassword(data: ChangePasswordRequest) {
  const response = await api.post("/auth/change-password", data);
  return response.data;
}

export async function deleteAccount() {
  const response = await api.delete("/settings/account");
  return response.data;
}
