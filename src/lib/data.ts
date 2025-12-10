import { fetchData, insertData, deleteData } from './client';

export interface Assignment {
  id: string; // e.g. 'CTPACKER 1'
  supervisorName: string | null;
  packerPickerName: string | null;
}

export interface Supervisor {
  id: string;
  name: string;
}

export const CTPACKER_SLOTS = 12;

export const initialAssignments: Assignment[] = Array.from({ length: CTPACKER_SLOTS }, (_, i) => ({
  id: `CTPACKER ${i + 1}`,
  supervisorName: null,
  packerPickerName: null,
}));

export const initialSupervisors: Supervisor[] = [
  { id: '1', name: 'RUDI' },
  { id: '2', name: 'JANE' },
  { id: '3', name: 'MIKE' },
  { id: '4', name: 'SOPHIA' },
];

// Client-side data handling
export async function getClientAssignments() {
  return await fetchData('assignments');
}

export async function addClientAssignment(assignment: Assignment) {
  return await insertData('assignments', assignment);
}

export async function removeClientAssignment(id: string) {
  return await deleteData('assignments', { id });
}

export async function getClientSupervisors() {
  return await fetchData('supervisors');
}

export async function addClientSupervisor(supervisor: Supervisor) {
  return await insertData('supervisors', supervisor);
}

export async function removeClientSupervisor(id: string) {
  return await deleteData('supervisors', { id });
}
