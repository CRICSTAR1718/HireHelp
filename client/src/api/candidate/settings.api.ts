import api from "./api";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: ChangePasswordRequest) {
  const response = await api.post("/auth/change-password", data);
  return response.data;
}
