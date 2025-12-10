/*
 * Script to seed the Supabase tables with example data.
 * Usage: node scripts/seed-supabase.js
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 * Note: Creating tables requires service role / SQL API. This script only inserts seed data if tables exist and the anon role has access.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function tableExists(table) {
  try {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error && error.code === 'PGRST205') {
      return false;
    }
    return true;
  } catch (e) {
    return false;
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

seed().catch(e => { console.error(e); process.exit(1); });
