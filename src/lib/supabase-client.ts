import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function looksLikeServiceKey(k?: string) {
  if (!k) return false;
  // Service role or secret keys used by Supabase often contain 'service_role' or 'sb_secret' or start with 'sb_'
  return /service_role|sb_secret|^sb_/.test(k);
}

if (!supabaseUrl || !supabaseAnonKey) {
  // Provide a clear, actionable error for developers
  console.error('[supabase-client] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
  throw new Error(
    'Supabase URL and/or anon public key are not defined in .env.local. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and restart the dev server.'
  );
}

if (looksLikeServiceKey(supabaseAnonKey)) {
  // Warn the developer if the anon key appears to be a service role / secret key.
  console.error(
    '\n[Supabase] The value in NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a service role or secret key.\n' +
      'This key must NOT be exposed to the browser. Replace it with the project anon/public key from Supabase dashboard (Project -> Settings -> API -> anon public key).\n'
  );
}

// Create a single Supabase client for interacting with your database
console.log('[supabase-client] INITIALIZING with NEXT_PUBLIC_SUPABASE_URL present:', !!supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Subscribe to real-time changes in a table.
 * @param tableName - The name of the table to subscribe to.
 * @param callback - A function to handle the real-time payload.
 * @returns A function to unsubscribe from the channel.
 */
export function subscribeToTableChanges(tableName: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel(`realtime:${tableName}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
      console.log(`[supabase-client] Real-time event received for table "${tableName}":`, payload);
      callback(payload);
    })
    .subscribe((status) => {
      console.log(`[supabase-client] Subscription status for table "${tableName}":`, status);
    });

  return () => {
    console.log(`[supabase-client] Unsubscribing from table "${tableName}"`);
    supabase.removeChannel(channel);
  };
}

/**
 * Update an assignment in the database.
 * @param assignment - The assignment object to update.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateAssignment(assignment: Partial<{ id: string; [key: string]: any }>) {
  if (!assignment.id) {
    throw new Error('[supabase-client] Assignment ID is required for updates.');
  }

  const { data, error } = await supabase
    .from('assignments')
    .update(assignment)
    .eq('id', assignment.id);

  if (error) {
    console.error('[supabase-client] Failed to update assignment:', error);
    throw error;
  }

  console.log('[supabase-client] Assignment updated successfully:', data);
  return data;
}