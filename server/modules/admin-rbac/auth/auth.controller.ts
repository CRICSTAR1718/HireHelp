import type { Request, Response, NextFunction } from "express";

import { AppError } from "../../../common/middleware/error-handler";
import * as authService from "./auth.service";
import type {
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  LoginResponse,
  RefreshTokenResponse,
  LogoutResponse,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  MeResponse,
} from "./auth.schema";

const getClientIp = (req: {
  ip?: string;
  socket: { remoteAddress?: string };
}): string => req.ip ?? req.socket.remoteAddress ?? "unknown";

const getUserAgent = (req: { headers: Request["headers"] }): string =>
  req.headers["user-agent"] ?? "";

export const login = async (
  req: Request<object, LoginResponse, LoginInput>,
  res: Response<LoginResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(
      req.body,
      getClientIp(req),
      getUserAgent(req)
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request<object, LogoutResponse, LogoutInput>,
  res: Response<LogoutResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.logout(req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request<object, RefreshTokenResponse, RefreshTokenInput>,
  res: Response<RefreshTokenResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.refreshToken(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response<MeResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await authService.getMe(req.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request<object, ChangePasswordResponse, ChangePasswordInput>,
  res: Response<ChangePasswordResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await authService.changePassword(req.user.userId, req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request<object, ForgotPasswordResponse, ForgotPasswordInput>,
  res: Response<ForgotPasswordResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request<object, ResetPasswordResponse, ResetPasswordInput>,
  res: Response<ResetPasswordResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};
