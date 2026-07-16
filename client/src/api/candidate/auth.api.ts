import api from "./api";

import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
} from "../../types/candidate/auth";

export const login = async (
    data: LoginRequest
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
};

export const register = async (
    data: RegisterRequest
): Promise<{ success: boolean; message: string }> => {

    const response = await api.post<{ success: boolean; message: string }>(
        "/auth/register",
        data
    );

    return response.data;
};

export const verifyEmail = async (
    email: string,
    otp: string
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/auth/verify-email",
        { email, otp }
    );

    return response.data;
};

export const resendOtp = async (
    email: string,
    purpose: string
): Promise<{ success: boolean; message: string }> => {

    const response = await api.post<{ success: boolean; message: string }>(
        "/auth/resend-otp",
        { email, purpose }
    );

    return response.data;
};

export default {
    login,
    register,
    verifyEmail,
    resendOtp,
};