export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  roleId: string;
  departmentId: string | null;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput { email: string; password: string; }

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: Pick<AuthUser, "id" | "email" | "firstName" | "lastName" | "roleId">;
}

export interface RefreshTokenResult { accessToken: string; refreshToken: string; }
export interface ChangePasswordInput { oldPassword: string; newPassword: string; }

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}