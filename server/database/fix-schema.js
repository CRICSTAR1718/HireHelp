import { Client } from 'pg';
import 'dotenv/config';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function fixSchema() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if uuid column exists
    const uuidCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'candidates' AND column_name = 'uuid'
    `);

    if (uuidCheck.rows.length === 0) {
      console.log('Adding uuid column to candidates table...');
      await client.query(`
        ALTER TABLE candidates 
        ADD COLUMN uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE
      `);
      await client.query(`CREATE INDEX idx_candidates_uuid ON candidates(uuid)`);
      console.log('✓ uuid column added');
    } else {
      console.log('✓ uuid column already exists');
    }

    // Check if is_verified column exists
    const verifiedCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'candidates' AND column_name = 'is_verified'
    `);

    if (verifiedCheck.rows.length === 0) {
      console.log('Adding is_verified column to candidates table...');
      await client.query(`
        ALTER TABLE candidates
        ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE
      `);
      console.log('✓ is_verified column added');
    } else {
      console.log('✓ is_verified column already exists');
    }

    // Check if candidate_otps table exists
    const otpsTableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'candidate_otps'
    `);

    if (otpsTableCheck.rows.length === 0) {
      console.log('Creating candidate_otps table...');
      await client.query(`
        CREATE TABLE candidate_otps (
          id BIGSERIAL PRIMARY KEY,
          candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
          email VARCHAR(255) NOT NULL,
          otp_hash VARCHAR(255) NOT NULL,
          purpose VARCHAR(50) NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          attempts INTEGER NOT NULL DEFAULT 0,
          is_used BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await client.query(`CREATE INDEX idx_candidate_otps_email ON candidate_otps(email)`);
      await client.query(`CREATE INDEX idx_candidate_otps_candidate_id ON candidate_otps(candidate_id)`);
      console.log('✓ candidate_otps table created');
    } else {
      console.log('✓ candidate_otps table already exists');
    }

    console.log('\n✅ Schema fix completed successfully!');
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
    throw error;
  } finally {
    await client.end();
  }
}

fixSchema();
