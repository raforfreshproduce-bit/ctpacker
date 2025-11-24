import DashboardClient from '@/components/dashboard/dashboard-client';
import { fetchServerData } from '@/lib/server';

export default async function Page() {
  let assignments: any[] | undefined = undefined;
  let supervisors: any[] | undefined = undefined;

  try {
    const result = await fetchServerData('assignments');
    if (Array.isArray(result) && result.length > 0) assignments = result;
  } catch (e) {
    console.error('Server fetch assignments error', e);
    assignments = undefined;
  }

  try {
    const result = await fetchServerData('supervisors');
    if (Array.isArray(result) && result.length > 0) supervisors = result;
  } catch (e) {
    console.error('Server fetch supervisors error', e);
    supervisors = undefined;
  }

  return <DashboardClient initialAssignments={assignments} initialSupervisors={supervisors} />;
}
