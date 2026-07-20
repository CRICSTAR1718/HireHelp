import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt";
import { AppError } from "./error-handler";

// ─────────────────────────────────────────────────────────────────────────────
// STAFF authentication middleware — recruiter / interviewer / admin.
// Candidate requests never hit this — see candidate-auth.ts for that flow.
//
// CHANGED FROM ORIGINAL: accepts the token from EITHER an `Authorization:
// Bearer` header (how the old admin-service frontend sent it) OR a `token`
// cookie (how the old recruitment-service frontend sent it). This lets both
// existing client/ apps keep working unmodified while they're merged into one
// frontend — once the merged frontend is done, standardize on one and delete
// the other branch here.
//
// Also dropped the raw console.log(token)/console.log(payload) debug lines
// that were in the original admin-service auth.ts — those would leak JWTs
// into server logs in production.
// ─────────────────────────────────────────────────────────────────────────────

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

function extractToken(req: Request): string | null {
  // Try httpOnly cookie first (new path)
  const cookieToken = req.cookies?.staff_access_token;
  if (cookieToken) {
    return cookieToken;
  }
  // Fallback to Authorization header for backward compatibility
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req);

  if (!token) {
    throw new AppError("Missing or invalid authorization", 401);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};
