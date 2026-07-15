import { EventEmitter } from "events";

// ─────────────────────────────────────────────────────────────────────────────
// In-process event bus — replaces Kafka now that every module lives in one
// process. Event NAMES and PAYLOAD SHAPES are unchanged from the old Kafka
// topics on purpose: this is a transport swap, not a contract change.
//
// Why not just call the other module's service function directly instead of
// going through an emitter? Because keeping the pub/sub shape:
//   1. preserves the existing module boundaries (a module still doesn't know
//      WHO consumes its events, same as it didn't know which service would
//      consume a Kafka topic)
//   2. means every publishEvent(...) call site in the old codebase needs a
//      changed IMPORT PATH ONLY, not a rewrite
//   3. supports multiple listeners per event without the publisher caring
//      (e.g. CandidateRejected is consumed by both admin's audit log AND,
//      later, talent-service's archival)
//
// This bus is NOT durable — if the process crashes mid-handler, the event is
// lost, unlike Kafka which persists to a log. That's an accepted tradeoff for
// a single-process monolith; revisit if/when a module gets split back out.
// ─────────────────────────────────────────────────────────────────────────────

class EventBus extends EventEmitter {
  constructor() {
    super();
    // Handlers can be slow (DB writes, etc.) — raise the default limit of 10
    // listeners so registering many handlers per event doesn't warn/leak.
    this.setMaxListeners(50);
  }
}

export const eventBus = new EventBus();

export interface EventEnvelope<T = Record<string, unknown>> {
  payload: T;
  _source: string;
  _ts: string;
}

/**
 * Publish an event. Signature matches every repo's old `publishEvent(topic,
 * payload)` Kafka helper, so call sites only need an import path change.
 */
export async function publishEvent(
  eventName: string,
  payload: Record<string, unknown>
): Promise<void> {
  const envelope: EventEnvelope = {
    payload,
    _source: "monolith",
    _ts: new Date().toISOString(),
  };

  const listeners = eventBus.listeners(eventName);

  if (listeners.length === 0) {
    // Matches the old "Kafka skip" debug log behavior when nothing consumes
    // a topic — helps catch typo'd event names during development.
    console.debug(`[events] no listeners for "${eventName}"`, payload);
    return;
  }

  // Run all handlers, but don't let one handler's failure block the others —
  // same isolation Kafka consumer groups gave you (one consumer group's
  // failure doesn't stop another group from processing the same message).
  await Promise.all(
    eventBus.rawListeners(eventName).map(async (listener) => {
      try {
        await (listener as (payload: Record<string, unknown>) => unknown)(payload);
      } catch (err) {
        console.error(`[events] handler for "${eventName}" failed:`, err);
      }
    })
  );
}

/**
 * Register a handler for an event. Replaces each old kafka-consumer.ts's
 * `switch (topic) { case 'X': ... }` dispatch — call this once per handler
 * at startup instead (see registerHandlers.ts).
 */
export function onEvent<T = Record<string, unknown>>(
  eventName: string,
  handler: (payload: T) => Promise<void> | void
): void {
  eventBus.on(eventName, handler as (...args: unknown[]) => void);
}
