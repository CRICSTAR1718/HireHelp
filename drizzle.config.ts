import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// ─────────────────────────────────────────────────────────────────────────────
// One migration set for the whole monolith, replacing the 4 separate
// drizzle.config.ts files (one per old repo, each against its own database).
// schema glob picks up every *.schema.ts file under database/schema/ —
// admin, candidate, recruitment, interview — so `drizzle-kit generate`
// produces one consistent migration covering all tables at once.
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  schema: './server/database/schema/*.schema.ts',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
