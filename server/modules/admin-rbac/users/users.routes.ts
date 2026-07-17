import { Router } from "express";

import { authenticate } from "../../../common/middleware/auth";
import { authorize } from "../../../common/middleware/rbac";
import { validate } from "../../../common/middleware/validate";
import {
  changeUserPassword,
  createUser,
  deactivateUser,
  getUserById,
  getUsersByRoleIds,
  listUsers,
  updateUser,
} from "./users.controller";
import { createUserSchema, updateUserSchema, changeUserPasswordSchema } from "./users.schema";

const router = Router();

router.get("/users", authenticate, authorize("users:manage"), listUsers);
router.get("/users/by-roles", authenticate, authorize("users:manage"), getUsersByRoleIds);
router.get("/users/:id", authenticate, authorize("users:manage"), getUserById);
router.post("/users", authenticate, authorize("users:manage"), validate(createUserSchema), createUser);
router.patch("/users/:id", authenticate, authorize("users:manage"), validate(updateUserSchema), updateUser);
router.patch("/users/:id/password", authenticate, authorize("users:manage"), validate(changeUserPasswordSchema), changeUserPassword);
router.delete("/users/:id", authenticate, authorize("users:manage"), deactivateUser);

export default router;
