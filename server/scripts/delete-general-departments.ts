import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { departments } from '../database/schema/admin.schema';
import { eq, like, or } from 'drizzle-orm';

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Create database connection using pg (same as server)
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const db = drizzle(pool);

async function deleteGeneralDepartments() {
  try {
    console.log('Searching for departments with name "general"...');
    
    // Find departments with name "general" (case-insensitive)
    const generalDepts = await db
      .select()
      .from(departments)
      .where(or(
        eq(departments.name, 'general'),
        eq(departments.name, 'General'),
        like(departments.name, '%general%'),
        like(departments.name, '%General%')
      ));
    
    console.log(`Found ${generalDepts.length} department(s) with name containing "general":`);
    generalDepts.forEach(dept => {
      console.log(`- ID: ${dept.id}, Name: ${dept.name}, Active: ${dept.isActive}`);
    });
    
    if (generalDepts.length === 0) {
      console.log('No departments found with name "general"');
      await pool.end();
      process.exit(0);
      return;
    }
    
    // Soft delete by setting isActive = false
    const result = await db
      .update(departments)
      .set({ isActive: false, updatedAt: new Date() })
      .where(or(
        eq(departments.name, 'general'),
        eq(departments.name, 'General'),
        like(departments.name, '%general%'),
        like(departments.name, '%General%')
      ))
      .returning();
    
    console.log(`Successfully soft-deleted ${result.length} department(s)`);
    result.forEach(dept => {
      console.log(`- ID: ${dept.id}, Name: ${dept.name} (now inactive)`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error deleting general departments:', error);
    await pool.end();
    process.exit(1);
  }
}

deleteGeneralDepartments();
