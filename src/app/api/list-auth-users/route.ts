import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, { status: 500 });
  }

  try {
    // List all auth users (requires service role)
    const { data: users, error } = await supabaseServer.auth.admin.listUsers();
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      users: users?.users?.map((u: any) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
      })) || [],
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
