import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE authentication — intentionally separate from staff auth.ts.
// Different JWT secret (CANDIDATE_JWT_SECRET, not JWT_SECRET), different
// payload shape ({ id: number, email } vs staff's { userId: uuid, roleId }).
//
// Do NOT let candidate routes import common/middleware/auth.ts (staff) or
// vice versa — that was flagged during the merge as a real risk once both
// lived in one process. This file exists specifically to prevent that
// collision. See candidates/auth/auth.service.ts for token issuance.
//
// CHANGED FROM ORIGINAL: was reading process.env.JWT_SECRET directly with an
// insecure 'default_secret' fallback — same issue as the token-generation
// side, fixed the same way (dedicated env var, no fallback).
// ─────────────────────────────────────────────────────────────────────────────

export interface CandidateAuthRequest extends Request {
  candidateUser?: {
    id: number;
    email: string;
  };
}

declare module "express" {
  interface Request {
    candidateUser?: {
      id: number;
      email: string;
    };
  }
}

export const authenticateCandidate = (
  req: CandidateAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.CANDIDATE_JWT_SECRET) as {
      id: number;
      email: string;
    };

    req.candidateUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalCandidateAuth = (
  req: CandidateAuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, env.CANDIDATE_JWT_SECRET) as {
        id: number;
        email: string;
      };
      req.candidateUser = decoded;
    }

    next();
  } catch {
    next();
  }
};
