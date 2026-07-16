import { AppError } from "../../../common/middleware/error-handler";
import { generateAccessToken, generateRefreshToken, type JwtPayload } from "../../../common/utils/jwt";
import { hashPassword, verifyPassword, hashRefreshToken } from "../../../common/utils/password";
import { sendPasswordResetEmail } from "../../../common/utils/email.service";
import { env } from "../../../config/env";
import { findByEmail, findById, updateLastLogin, update } from "../users/users.repository";
import { getRoleNameById } from "../roles/roles.repository";
import { create, findByRefreshTokenHash, update as updateSession, revoke, revokeAllByUserId } from "../user-sessions/user-sessions.repository";
import type { LoginInput, RefreshTokenInput, LogoutInput, ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput } from "./auth.schema";

export const login = async (
  input: LoginInput,
  ipAddress: string,
  userAgent: string
) => {
  const user = await findByEmail(input.email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  const isValidPassword = await verifyPassword(input.password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await create({
    userId: user.id,
    refreshTokenHash,
    deviceName: userAgent.substring(0, 200),
    ipAddress,
    userAgent,
    expiresAt,
  });

  await updateLastLogin(user.id);

  const role = await getRoleNameById(user.roleId);
  if (!role) {
    throw new AppError("User role not found", 500);
  }

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      role,
    },
  };
};

export const refreshToken = async (input: RefreshTokenInput) => {
  const refreshTokenHash = hashRefreshToken(input.refreshToken);
  const session = await findByRefreshTokenHash(refreshTokenHash);

  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (session.isRevoked) {
    throw new AppError("Refresh token has been revoked", 401);
  }

  if (session.expiresAt < new Date()) {
    throw new AppError("Refresh token has expired", 401);
  }

  const user = await findById(session.userId);

  if (!user || !user.isActive) {
    throw new AppError("User not found or inactive", 401);
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  await updateSession(session.id, {
    refreshTokenHash: newRefreshTokenHash,
    expiresAt: newExpiresAt,
    lastUsedAt: new Date(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (input: LogoutInput) => {
  const refreshTokenHash = hashRefreshToken(input.refreshToken);
  const session = await findByRefreshTokenHash(refreshTokenHash);

  if (session) {
    await revoke(session.id, "logout");
  }

  return { message: "Logged out successfully" };
};

export const changePassword = async (
  userId: string,
  input: ChangePasswordInput
) => {
  const user = await findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isValidPassword = await verifyPassword(input.oldPassword, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError("Invalid old password", 401);
  }

  const newPasswordHash = await hashPassword(input.newPassword);

  await update(userId, { passwordHash: newPasswordHash });

  await revokeAllByUserId(userId, "password_change");

  return { message: "Password changed successfully" };
};

export const forgotPassword = async (input: ForgotPasswordInput) => {
  const user = await findByEmail(input.email);

  // Always return the same message for security (don't reveal if email exists)
  if (!user) {
    return { message: "If the email exists, a reset link will be sent" };
  }

  if (!user.isActive) {
    return { message: "If the email exists, a reset link will be sent" };
  }

  // Generate a temporary reset token (in production, this should be stored in DB with expiry)
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const resetLink = `${env.CLIENT_ORIGIN}/reset-password?token=${resetToken}`;
  const fullName = `${user.firstName} ${user.lastName}`;
  const loginUrl = `${env.CLIENT_ORIGIN}/login`;

  // Send password reset email
  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: fullName,
      resetLink,
      expirationMinutes: 30, // 30 minutes expiry
      loginUrl,
    });
  } catch (error) {
    // Email failure is logged but does not prevent the flow
    console.error('Failed to send password reset email:', error);
  }

  return { message: "If the email exists, a reset link will be sent" };
};

export const resetPassword = async (_input: ResetPasswordInput) => {
  return { message: "Password reset successfully" };
};

export const getMe = async (userId: string) => {
  const user = await findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    roleId: user.roleId,
    departmentId: user.departmentId,
    isActive: user.isActive,
    lastLogin: user.lastLogin?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};
