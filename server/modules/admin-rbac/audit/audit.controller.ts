import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../common/middleware/error-handler";
import * as auditService from "./audit.service";
import { auditListQuerySchema, auditParamsSchema } from "./audit.schema";
import type { AuditData } from "./audit.service";
type ListResponse = { success: true; data: AuditData[] }; type ItemResponse = { success: true; data: AuditData };
export const listAuditLogs = async (req: Request, res: Response<ListResponse>, next: NextFunction): Promise<void> => { try { const query = auditListQuerySchema.safeParse(req.query); if (!query.success) throw new AppError(query.error.errors.map((e) => e.message).join(", "), 400); res.status(200).json({ success: true, data: await auditService.listAuditLogs(query.data) }); } catch (error) { next(error); } };
export const getAuditLogById = async (req: Request, res: Response<ItemResponse>, next: NextFunction): Promise<void> => { try { const params = auditParamsSchema.safeParse(req.params); if (!params.success) throw new AppError(params.error.errors.map((e) => e.message).join(", "), 400); res.status(200).json({ success: true, data: await auditService.getAuditLogById(params.data.id) }); } catch (error) { next(error); } };