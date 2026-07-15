export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogDetails extends AuditLog {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
