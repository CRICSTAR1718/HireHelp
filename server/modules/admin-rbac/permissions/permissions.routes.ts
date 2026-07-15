import { Router } from "express";

import { authenticate } from "../../../common/middleware/auth";
import { authorize } from "../../../common/middleware/rbac";
import { validate } from "../../../common/middleware/validate";
import {
  createPermission,
  deletePermission,
  getPermissionById,
  listPermissions,
  updatePermission,
} from "./permissions.controller";
import { createPermissionSchema, updatePermissionSchema } from "./permissions.schema";

const router = Router();

router.get("/permissions", authenticate, authorize("roles:manage"), listPermissions);
router.get("/permissions/:id", authenticate, authorize("roles:manage"), getPermissionById);
router.post("/permissions", authenticate, authorize("roles:manage"), validate(createPermissionSchema), createPermission);
router.patch("/permissions/:id", authenticate, authorize("roles:manage"), validate(updatePermissionSchema), updatePermission);
router.delete("/permissions/:id", authenticate, authorize("roles:manage"), deletePermission);

export default router;
