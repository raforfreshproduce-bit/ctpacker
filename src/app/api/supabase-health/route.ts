import { NextResponse } from 'next/server';
import { fetchServerData } from '@/lib/server';

export async function GET() {
  try {
    const assignments = await fetchServerData('assignments');
    const supervisors = await fetchServerData('supervisors');

    return NextResponse.json({ ok: true, assignmentsCount: assignments ? assignments.length : 0, supervisorsCount: supervisors ? supervisors.length : 0 });
  } catch (err) {
    console.error('Supabase health check error', err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
