import type { Request, Response, NextFunction } from "express";

import { AppError } from "../../../common/middleware/error-handler";
import { env } from "../../../config/env";
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

// Cookie options for httpOnly cookies
const getCookieOptions = () => {
  const isProduction = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction, // Only require HTTPS in production
    sameSite: isProduction ? 'none' as const : 'lax' as const,
    domain: isProduction ? '.hirehelp.online' : undefined, // Only set domain in production
    path: '/',
  };
};

// Parse JWT_EXPIRES_IN to milliseconds for cookie maxAge
const parseExpiresToMs = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 3600000; // Default 1 hour
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
    default: return 3600000;
  }
};

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
    
    // Set httpOnly cookies for staff auth
    const cookieOptions = getCookieOptions();
    const accessMaxAge = parseExpiresToMs(env.JWT_EXPIRES_IN);
    const refreshMaxAge = parseExpiresToMs(env.JWT_REFRESH_EXPIRES_IN);
    
    res.cookie('staff_access_token', result.accessToken, {
      ...cookieOptions,
      maxAge: accessMaxAge,
    });
    res.cookie('staff_refresh_token', result.refreshToken, {
      ...cookieOptions,
      maxAge: refreshMaxAge,
    });
    
    // Keep JSON response for backward compatibility during rollout
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
    
    // Clear httpOnly cookies with same options used when setting
    const cookieOptions = getCookieOptions();
    res.clearCookie('staff_access_token', cookieOptions);
    res.clearCookie('staff_refresh_token', cookieOptions);
    
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
    // Try cookie-based refresh first (new path)
    const cookieRefreshToken = req.cookies?.staff_refresh_token;
    if (cookieRefreshToken) {
      const result = await authService.refreshToken({ refreshToken: cookieRefreshToken });
      
      // Set new cookies
      const cookieOptions = getCookieOptions();
      const accessMaxAge = parseExpiresToMs(env.JWT_EXPIRES_IN);
      const refreshMaxAge = parseExpiresToMs(env.JWT_REFRESH_EXPIRES_IN);
      
      res.cookie('staff_access_token', result.accessToken, {
        ...cookieOptions,
        maxAge: accessMaxAge,
      });
      res.cookie('staff_refresh_token', result.refreshToken, {
        ...cookieOptions,
        maxAge: refreshMaxAge,
      });
      
      res.status(200).json({ success: true, data: result });
      return;
    }
    
    // Fallback to body-based refresh for backward compatibility
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
