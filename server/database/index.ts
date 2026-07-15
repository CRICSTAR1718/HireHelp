import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { env } from '../config/env';

// ─────────────────────────────────────────────────────────────────────────────
// ONE Postgres connection for the whole monolith, replacing the 4 separate
// connections each old repo held to its own database. Standardized on
// node-postgres (pg) since 3 of the 4 original repos already used it —
// admin-service was the outlier on postgres-js, migrated here to match.
//
// Not passing `{ schema }` into drizzle() enables the relational query API
// (db.query.*) — none of the original repos actually used it (all used
// db.select()/.insert()/.update() query-builder style), but it's harmless
// to have available now that everything's in one schema object anyway.
// ─────────────────────────────────────────────────────────────────────────────

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
export { pool };
