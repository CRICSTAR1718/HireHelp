import { z } from "zod";

// Login
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      roleId: z.string(),
      role: z.string(),
    }),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Refresh Token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const refreshTokenResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

// Logout
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LogoutInput = z.infer<typeof logoutSchema>;

export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;

// Change Password
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const changePasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ChangePasswordResponse = z.infer<typeof changePasswordResponseSchema>;

// Forgot Password (placeholder)
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>;

// Reset Password (placeholder)
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const resetPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;

// Get Current User (/me)
export const meResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().nullable(),
    roleId: z.string(),
    departmentId: z.string().nullable(),
    isActive: z.boolean(),
    lastLogin: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
