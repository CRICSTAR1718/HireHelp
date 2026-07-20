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

export const verifyLoginOtp = async (
    email: string,
    otp: string
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/auth/verify-login-otp",
        { email, otp }
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

export const forgotPassword = async (
    email: string
): Promise<{ success: boolean; message: string }> => {

    const response = await api.post<{ success: boolean; message: string }>(
        "/auth/forgot-password",
        { email }
    );

    return response.data;
};

export const verifyResetOtp = async (
    email: string,
    otp: string
): Promise<{ success: boolean; message: string }> => {

    const response = await api.post<{ success: boolean; message: string }>(
        "/auth/verify-reset-otp",
        { email, otp }
    );

    return response.data;
};

export const resetPassword = async (
    email: string,
    newPassword: string
): Promise<{ success: boolean; message: string }> => {

    const response = await api.post<{ success: boolean; message: string }>(
        "/auth/reset-password",
        { email, newPassword }
    );

    return response.data;
};

export default {
    login,
    verifyLoginOtp,
    register,
    verifyEmail,
    resendOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
};