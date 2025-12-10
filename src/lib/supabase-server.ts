import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Do not throw here: only server routes that need admin access will import this file.
  // But warn in logs if missing when imported.
  // eslint-disable-next-line no-console
  console.warn('[supabase-server] SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set; admin operations will fail.');
}

console.log('[supabase-server] Initializing Supabase client with URL:', supabaseUrl);
console.log('[supabase-server] Using service role key:', supabaseServiceKey ? 'Provided' : 'Not Provided');

export const supabaseServer = createClient(supabaseUrl ?? '', supabaseServiceKey ?? '');

export function createServerClient() {
  return supabaseServer;
}
