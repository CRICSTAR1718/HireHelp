import { Pool } from 'pg';

// Get DATABASE_URL from environment or use a default
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigration() {
  try {
    console.log('Running migration to add profile_picture_url column to profiles table...');
    const safeDatabaseUrl = databaseUrl?.substring(0, 20) + '...' || '';
    console.log('Database URL:', safeDatabaseUrl);

    // Check if profilePictureUrl column exists
    const profilePictureCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'profiles'
      AND column_name = 'profile_picture_url'
    `);

    if (profilePictureCheck.rows.length === 0) {
      console.log('Adding profile_picture_url column...');
      await pool.query(`
        ALTER TABLE "profiles"
        ADD COLUMN "profile_picture_url" varchar(500)
      `);
      console.log('profile_picture_url column added successfully');
    } else {
      console.log('profile_picture_url column already exists, skipping...');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
