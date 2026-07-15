import { z } from "zod";
export const auditParamsSchema = z.object({ id: z.string().uuid("Invalid audit ID") });
export const auditListQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(100).default(50), offset: z.coerce.number().int().min(0).default(0) });
export type AuditListQueryInput = z.infer<typeof auditListQuerySchema>;