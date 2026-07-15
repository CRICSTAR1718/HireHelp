import { Router } from "express";

import { authenticate } from "../../../common/middleware/auth";
import { authorize } from "../../../common/middleware/rbac";
import { validate } from "../../../common/middleware/validate";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  listDepartments,
  updateDepartment,
} from "./departments.controller";
import { createDepartmentSchema, updateDepartmentSchema } from "./departments.schema";

const router = Router();

router.get("/departments", authenticate, authorize("departments:list"), listDepartments);
router.get("/departments/:id", authenticate, authorize("departments:read"), getDepartmentById);
router.post("/departments", authenticate, authorize("departments:create"), validate(createDepartmentSchema), createDepartment);
router.patch("/departments/:id", authenticate, authorize("departments:update"), validate(updateDepartmentSchema), updateDepartment);
router.delete("/departments/:id", authenticate, authorize("departments:delete"), deleteDepartment);

export default router;