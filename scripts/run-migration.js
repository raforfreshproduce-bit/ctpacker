/*
 * Run SQL migrations using Node and `pg`.
 * Usage: DB_URL=postgresql://user:password@host:port/database node scripts/run-migration.js
 * This script executes `db/migrations/001_create_tables.sql` in the database.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const dbUrl = process.env.DB_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('Please set DB_URL or SUPABASE_DB_URL to your database connection string.');
    process.exit(1);
  }

  const filePath = path.join(__dirname, '../db/migrations/001_create_tables.sql');
  if (!fs.existsSync(filePath)) {
    console.error('SQL migration file not found at', filePath);
    process.exit(1);
  }

  const sql = fs.readFileSync(filePath, 'utf8');
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    console.log('Running migration script...');
    await client.query(sql);
    console.log('Migration success');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
