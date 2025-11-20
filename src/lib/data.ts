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

export const initialSupervisors: Supervisor[] = [];
