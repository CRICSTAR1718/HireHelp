export interface AuditLog {
  id: string;
  userId: string | null;
  userName?: string | null;
  userEmail?: string | null;
  action: string;
  resource: string;
  metadata: Record<string, unknown>;
  ipAddress: string;
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
