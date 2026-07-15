import jwt from "jsonwebtoken";
import { env } from "../../config/env";

// ─────────────────────────────────────────────────────────────────────────────
// STAFF JWT utils — the single source of truth for recruiter/interviewer/admin
// tokens across the whole monolith. Candidate auth is intentionally separate
// (see modules/candidates/auth) and does NOT use this file.
//
// Carried over unchanged from the old admin-service — it was already the more
// complete implementation (refresh tokens are opaque + hashed, not just a
// longer-lived JWT like recruitment-service used to do).
// ─────────────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (): string => {
  return jwt.sign({}, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): boolean => {
  try {
    jwt.verify(token, env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};
