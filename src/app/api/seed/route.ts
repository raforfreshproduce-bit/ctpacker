import { NextResponse } from 'next/server';
import { insertServerData } from '@/lib/server';

export async function POST() {
  try {
    // Simple sample data
    const supervisors = [
      { id: '1', name: 'ALEX' },
      { id: '2', name: 'MIA' },
    ];

    for (const sup of supervisors) {
      try {
        await insertServerData('supervisors', sup);
      } catch (e) {
        console.error('Error inserting supervisor', sup, e);
      }
    }

    const assignments = Array.from({ length: 12 }, (_, i) => ({
      id: `CTPACKER ${i + 1}`,
      supervisor_name: i % 3 === 0 ? 'ALEX' : null,
      packer_picker_name: null,
    }));

    for (const a of assignments) {
      try {
        await insertServerData('assignments', a);
      } catch (e) {
        console.error('Error inserting assignment', a, e);
      }
    }

    return NextResponse.json({ ok: true, message: 'seed attempted (see logs for insert results)' });
  } catch (err) {
    console.error('seed route error', err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
