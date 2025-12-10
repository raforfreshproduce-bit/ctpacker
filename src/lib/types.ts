export interface Assignment {
  id: string; // e.g. 'CTPACKER 1'
  supervisorName: string | null;
  packerPickerName: string | null;
}

export interface Supervisor {
  id: string;
  name: string;
}