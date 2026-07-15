// ─────────────────────────────────────────────────────────────────────────────
// Merged database schema for the HireHelp monolith.
// One Postgres database, tables grouped by module (admin / candidate /
// recruitment / interview) instead of by separate service databases.
//
// Import from THIS file everywhere (`import { users, job_requisitions } from
// '@/database/schema'`) rather than reaching into individual module files
// directly — keeps repository code stable if a table ever moves between
// modules later.
//
// drizzle.config.ts should point its `schema` glob at this folder:
//   schema: './server/database/schema/*.schema.ts'
// ─────────────────────────────────────────────────────────────────────────────

export * from './admin.schema';
export * from './candidate.schema';
export * from './recruitment.schema';
export * from './interview.schema';
