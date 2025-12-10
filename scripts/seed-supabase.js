/*
 * Script to seed the Supabase tables with example data.
 * Usage: node scripts/seed-supabase.js
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * This script uses the service_role key to bypass RLS policies for seeding.
 */

const { createClient } = require('@supabase/supabase-js');
// Load environment variables from .env.local for local development
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function tableExists(table) {
  try {
    // Use rpc to call a PostgreSQL function that checks for table existence, which is more direct and robust.
    const { data, error } = await supabase.rpc('table_exists', { table_name: table });

    if (error) {
      // If the rpc call itself fails, something is wrong (e.g., permissions, network).
      console.error(`Error checking for table '${table}':`, error.message);
      // This could happen if the `table_exists` function hasn't been created in the DB yet.
      if (error.code === '42883') { // "function does not exist"
        console.error(`Hint: The RPC function 'table_exists' may not be defined. Please run the required SQL command in your Supabase editor.`);
      }
      throw error;
    }

    return data;
  } catch (e) {
    // Catching and re-throwing allows us to add context without losing the original error stack.
    console.error(`An unexpected error occurred while checking for table '${table}'.`);
    throw e;
  }
}

async function seed() {
  const supExists = await tableExists('supervisors');
  const assignExists = await tableExists('assignments');

  console.log('supervisors exist:', supExists);
  console.log('assignments exist:', assignExists);

  if (!supExists || !assignExists) {
    console.error('One or more tables do not exist; run the SQL migration first via the Supabase SQL editor.');
    process.exit(1);
  }

  // Insert sample supervisors
  const supervisors = [
    { id: '1', name: 'ALEX' },
    { id: '2', name: 'MIA' },
  ];

  for (const sp of supervisors) {
    const { error } = await supabase.from('supervisors').upsert(sp).single();
    if (error) console.error('Error upserting supervisor', sp, error.message);
  }

  // Insert sample assignments
  const assignments = Array.from({ length: 12 }, (_, i) => ({
    id: `CTPACKER ${i+1}`,
    supervisor_name: i % 3 === 0 ? 'ALEX' : null,
    packer_picker_name: null
  }));

  for (const a of assignments) {
    const { error } = await supabase.from('assignments').upsert(a).single();
    if (error) console.error('Error upserting assignment', a, error.message);
  }

  console.log('Seed complete');
}

async function main() {
  // Important: Before running this script, you must create the `table_exists` function in your Supabase database.
  // Go to the SQL Editor in your Supabase dashboard and run the following SQL command once:
  /*
    CREATE OR REPLACE FUNCTION table_exists(table_name text)
    RETURNS boolean AS $$
    BEGIN
      RETURN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND information_schema.tables.table_name = $1);
    END;
    $$ LANGUAGE plpgsql;
  */
  await seed();
}

main().catch(e => { console.error(e); process.exit(1); });
