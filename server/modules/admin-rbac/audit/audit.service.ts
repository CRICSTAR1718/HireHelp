import { AppError } from "../../../common/middleware/error-handler";
import { findAll, findById, type AuditLog } from "./audit.repository";
export type AuditData = { id: string; userId: string | null; action: string; resource: string; metadata: Record<string, unknown>; ipAddress: string; createdAt: string };
const toData = (log: AuditLog): AuditData => ({ id: log.id, userId: log.userId, action: log.action, resource: log.resource, metadata: log.metadata, ipAddress: log.ipAddress, createdAt: log.createdAt.toISOString() });
export const listAuditLogs = async (params: { limit: number; offset: number }): Promise<AuditData[]> => (await findAll(params)).map(toData);
export const getAuditLogById = async (id: string): Promise<AuditData> => { const log = await findById(id); if (!log) throw new AppError("Audit log not found", 404); return toData(log); };