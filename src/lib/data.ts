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

// Some initial data for demonstration purposes
initialAssignments[0].supervisorName = 'RUDI';
initialAssignments[0].packerPickerName = 'John Doe';
initialAssignments[1].supervisorName = 'JANE';
initialAssignments[1].packerPickerName = 'Peter Pan';
initialAssignments[3].supervisorName = 'RUDI';
initialAssignments[3].packerPickerName = 'Alice Wonderland RECOUNT';

export const initialSupervisors: Supervisor[] = [
  { id: '1', name: 'RUDI' },
  { id: '2', name: 'JANE' },
  { id: '3', name: 'MIKE' },
  { id: '4', name: 'SOPHIA' },
];
