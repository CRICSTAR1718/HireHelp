import { db } from '../../../../database';
import { auditLogs } from '../../../../database/schema';

// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE — the old admin-service's kafka-consumer.ts / kafka-producer.ts
// were both empty (0 bytes), so "admin-service consumes broadly for audit"
// was documented in AGENTS.md but never implemented. This closes that gap.
//
// One generic handler registered against every event in
// events/catalog.ts's AUDIT_LOGGED_EVENTS list, rather than one handler
// per event — matches the original intent ("purely to write them into the
// audit log") without hand-writing N near-identical functions.
// ─────────────────────────────────────────────────────────────────────────────

export async function handleAuditableEvent(
  eventName: string,
  payload: Record<string, unknown>
): Promise<void> {
  await db.insert(auditLogs).values({
    userId: (payload.userId as string) ?? (payload.approvedBy as string) ?? (payload.rejectedBy as string) ?? null,
    action: eventName,
    resource: 'event-bus',
    metadata: payload,
    // In-process events have no request IP — record that explicitly rather
    // than silently defaulting to something misleading like '127.0.0.1'.
    ipAddress: 'internal',
  });
}
