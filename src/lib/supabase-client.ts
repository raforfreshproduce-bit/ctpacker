import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function looksLikeServiceKey(k?: string) {
  if (!k) return false;
  // service role or secret keys used by Supabase often contain 'service_role' or 'sb_secret' or start with 'sb_'
  return /service_role|sb_secret|^sb_/.test(k);
}

if (!supabaseUrl || !supabaseAnonKey) {
  // Provide a clear, actionable error for developers
  // Do not disclose secrets in logs beyond indicating what's missing.
  // Throwing here prevents the app from silently failing with 401s.
  // Log presence for diagnostics
  // eslint-disable-next-line no-console
  console.error('[supabase-client] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
  throw new Error('Supabase URL and/or anon public key are not defined in .env.local. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and restart the dev server.');
}

if (looksLikeServiceKey(supabaseAnonKey)) {
  // Warn the developer if the anon key appears to be a service role / secret key.
  // Using a service role key in the browser is insecure; log a clear message.
  // Do NOT replace the key automatically.
  // eslint-disable-next-line no-console
  console.error('\n[Supabase] The value in NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a service role or secret key.\n' +
    'This key must NOT be exposed to the browser. Replace it with the project anon/public key from Supabase dashboard (Project -> Settings -> API -> anon public key).\n');
}

// Create a single supabase client for interacting with your database
// Log the URL presence without printing secrets
// eslint-disable-next-line no-console
console.log('[supabase-client] INITIALIZING with NEXT_PUBLIC_SUPABASE_URL present:', !!supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-time subscription example
export function subscribeToTableChanges(tableName: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel(`realtime:${tableName}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
      console.log('Change received:', payload);
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}