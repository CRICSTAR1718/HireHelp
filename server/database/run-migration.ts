import 'dotenv/config';
import { Pool } from 'pg';
import { env } from '../config/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigration() {
  try {
    console.log('Running migration to add UUID column to candidates table...');
    
    // Check if column already exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'candidates' 
      AND column_name = 'uuid'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('Adding UUID column...');
      await pool.query(`
        ALTER TABLE "candidates" 
        ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid() NOT NULL
      `);
      console.log('UUID column added successfully');
    } else {
      console.log('UUID column already exists, skipping...');
    }
    
    // Check if constraint already exists
    const constraintCheck = await pool.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'candidates' 
      AND constraint_name = 'candidates_uuid_unique'
    `);
    
    if (constraintCheck.rows.length === 0) {
      console.log('Adding UUID unique constraint...');
      await pool.query(`
        ALTER TABLE "candidates" 
        ADD CONSTRAINT "candidates_uuid_unique" UNIQUE("uuid")
      `);
      console.log('UUID unique constraint added successfully');
    } else {
      console.log('UUID unique constraint already exists, skipping...');
    }
    
    // Update any existing NULL UUIDs
    const result = await pool.query(`
      UPDATE "candidates" 
      SET "uuid" = gen_random_uuid() 
      WHERE "uuid" IS NULL
    `);
    
    console.log(`Updated ${result.rowCount} existing candidates with UUIDs`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
