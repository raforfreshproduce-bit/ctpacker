import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server' }, { status: 500 });
  }

  const supervisors = [
    { first: 'Rudi', last: 'Witboi' },
    { first: 'Zola', last: 'Mayatula' },
    { first: 'Thando', last: 'Lawrence Ngogela' },
    { first: 'Yolisa', last: 'Mshumpela' },
  ];

  const created: any[] = [];
  const errors: any[] = [];

  for (const s of supervisors) {
    const username = (s.first + s.last).replace(/\s+/g, '').toLowerCase();
    const email = `${username}@example.com`;
    const password = 'password';

    try {
      // Create auth user (admin)
      const { data: user, error: userError } = await supabaseServer.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: `${s.first.toUpperCase()} ${s.last.toUpperCase()}` },
      });

      if (userError) {
        errors.push({ username, error: userError.message });
      } else {
        created.push({ username, email, id: (user as any)?.id });
      }

      // Upsert supervisor row in supervisors table
      const supRow = { id: username, name: `${s.first.toUpperCase()} ${s.last.toUpperCase()}` };
      const { error: insertErr } = await supabaseServer.from('supervisors').upsert(supRow);
      if (insertErr) errors.push({ username, tableError: insertErr.message });
    } catch (e: any) {
      errors.push({ username: (s.first + s.last).toLowerCase(), error: e?.message ?? String(e) });
    }
  }

  // Create 12 assignment rows if missing
  try {
    const assignments = Array.from({ length: 12 }, (_, i) => ({ id: `CTPACKER ${i + 1}`, supervisor_name: null, packer_picker_name: null }));
    for (const a of assignments) {
      await supabaseServer.from('assignments').upsert(a);
    }
  } catch (e: any) {
    errors.push({ assignments: e?.message ?? String(e) });
  }

  return NextResponse.json({ ok: true, created, errors });
}
