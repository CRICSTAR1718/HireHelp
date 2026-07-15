import { app } from './app';
import { env } from './config/env';
import { registerAllEventHandlers } from './events/registerHandlers';

// ─────────────────────────────────────────────────────────────────────────────
// Replaces 4 separate index.ts files (candidate/recruitment/admin/interview)
// plus api-gateway's — one process, one port, one startup sequence.
//
// Event handlers are registered BEFORE the server starts accepting requests,
// same ordering the old repos used for connectConsumer()/startConsumer() —
// so nothing can publish an event before anything is listening for it.
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  await registerAllEventHandlers();

  app.listen(env.PORT, () => {
    console.log(`✓ HireHelp monolith listening on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
