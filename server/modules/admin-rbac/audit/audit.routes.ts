import { Router } from "express";
import { authenticate } from "../../../common/middleware/auth";
import { authorize } from "../../../common/middleware/rbac";
import { getAuditLogById, listAuditLogs } from "./audit.controller";
const router = Router();
router.get("/audit", authenticate, authorize("audit:list"), listAuditLogs);
router.get("/audit/:id", authenticate, authorize("audit:read"), getAuditLogById);
export default router;