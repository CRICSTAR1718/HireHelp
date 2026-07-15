import { Router } from "express";

import { authenticate } from "../../../common/middleware/auth";
import { authorize } from "../../../common/middleware/rbac";
import { validate } from "../../../common/middleware/validate";
import {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  listRolePermissions,
  assignPermission,
  revokePermission,
  updateRole,
} from "./roles.controller";
import { createRoleSchema, updateRoleSchema, assignPermissionSchema } from "./roles.schema";

const router = Router();

router.get("/roles", authenticate, authorize("roles:manage"), listRoles);
router.get("/roles/:id", authenticate, authorize("roles:manage"), getRoleById);
router.post("/roles", authenticate, authorize("roles:manage"), validate(createRoleSchema), createRole);
router.patch("/roles/:id", authenticate, authorize("roles:manage"), validate(updateRoleSchema), updateRole);
router.delete("/roles/:id", authenticate, authorize("roles:manage"), deleteRole);

router.get("/roles/:id/permissions", authenticate, authorize("roles:manage"), listRolePermissions);
router.post("/roles/:id/permissions", authenticate, authorize("roles:manage"), validate(assignPermissionSchema), assignPermission);
router.delete("/roles/:id/permissions/:permissionId", authenticate, authorize("roles:manage"), revokePermission);

export default router;
