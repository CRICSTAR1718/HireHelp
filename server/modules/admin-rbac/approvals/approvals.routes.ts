import { Router } from "express";

import { authenticate } from "../../../common/middleware/auth";
import { authorize } from "../../../common/middleware/rbac";
import {
  listApprovals,
  getApprovalById,
  approveApproval,
  rejectApproval,
} from "./approvals.controller";

const router = Router();

router.get("/", authenticate, authorize("approvals:list"), listApprovals);
router.get("/:id", authenticate, authorize("approvals:read"), getApprovalById);
router.post("/:id/approve", authenticate, authorize("approvals:approve"), approveApproval);
router.post("/:id/reject", authenticate, authorize("approvals:reject"), rejectApproval);

export default router;
