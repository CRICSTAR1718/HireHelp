export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    // backend returns { token: string, candidate: {...} } (or { accessToken } in some versions)
    accessToken?: string;
    token?: string;
    candidate?: User;
    requiresOtp?: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}