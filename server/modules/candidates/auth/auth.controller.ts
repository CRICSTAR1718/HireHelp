import { Request, Response } from 'express';
import { env } from '../../../config/env.js';
import { authService } from './auth.service.js';

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

// Parse CANDIDATE_JWT_EXPIRES_IN to milliseconds for cookie maxAge
const parseExpiresToMs = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 604800000; // Default 7 days
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
    default: return 604800000;
  }
};

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyRegistration(email, otp);
      
      // Set httpOnly cookie for candidate auth
      const cookieOptions = getCookieOptions();
      const maxAge = parseExpiresToMs(env.CANDIDATE_JWT_EXPIRES_IN);
      
      res.cookie('candidate_access_token', result.token, {
        ...cookieOptions,
        maxAge,
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await authService.login(data);
      
      // Set httpOnly cookie for candidate auth
      const cookieOptions = getCookieOptions();
      const maxAge = parseExpiresToMs(env.CANDIDATE_JWT_EXPIRES_IN);
      
      res.cookie('candidate_access_token', result.token, {
        ...cookieOptions,
        maxAge,
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async verifyLoginOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyLoginOtp(email, otp);
      
      // Set httpOnly cookie for candidate auth
      const cookieOptions = getCookieOptions();
      const maxAge = parseExpiresToMs(env.CANDIDATE_JWT_EXPIRES_IN);
      
      res.cookie('candidate_access_token', result.token, {
        ...cookieOptions,
        maxAge,
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { email, purpose } = req.body;
      const result = await authService.resendOtp(email, purpose);
      res.status(200).json(result);
    } catch (error) {
      res.status(429).json({ error: (error as Error).message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async verifyResetOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyResetOtp(email, otp);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;
      const result = await authService.resetPassword(email, newPassword);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const candidate = await authService.getProfile(req.candidateUser.id);
      res.status(200).json(candidate);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.candidateUser.id, currentPassword, newPassword);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Clear httpOnly cookie with same options used when setting
      const cookieOptions = getCookieOptions();
      res.clearCookie('candidate_access_token', cookieOptions);
      
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export const authController = new AuthController();
