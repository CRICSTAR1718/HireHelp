import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error-handler";
import * as authorizationService from "../../modules/admin-rbac/permissions/authorization.service";
import { getRoleNameById } from "../../modules/admin-rbac/roles/roles.repository";

// ─────────────────────────────────────────────────────────────────────────────
// Two authorization styles, both backed by the same roleId on req.user:
//
// 1. authorize(permission) — fine-grained, resource+action based, from the old
//    admin-service. Use this for admin-rbac routes and any NEW route.
//
// 2. requireRole(...roleNames) — coarse role-name check, matches how
//    recruitment-service and interview-service routes were originally
//    written (e.g. `authorize('hr', 'admin')`). Kept so those existing route
//    files only need an IMPORT PATH change, not a logic rewrite, during this
//    merge. Resolves req.user.roleId -> role name via a small lookup.
//
// Migrate call sites from (2) to (1) opportunistically post-merge — (1) is
// the more correct long-term model since it's driven by the `permissions`
// table, not a hardcoded string in route code.
// ─────────────────────────────────────────────────────────────────────────────

export const authorize = (permission: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const allowed = await authorizationService.hasPermission(req.user.roleId, permission);

      if (!allowed) {
        throw new AppError("Forbidden", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireRole = (...roleNames: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const roleName = await getRoleNameById(req.user.roleId);

      if (!roleName || !roleNames.includes(roleName)) {
        throw new AppError(
          `Access denied — required role: ${roleNames.join(" or ")}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
