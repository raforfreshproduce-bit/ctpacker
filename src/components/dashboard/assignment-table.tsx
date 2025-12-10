import { Table, TableBody, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import type { Assignment, Supervisor } from '@/lib/types';
import AssignmentRow from './assignment-row';

interface AssignmentTableProps {
  assignments: Assignment[];
  supervisors: Supervisor[];
  onUpdateAssignment: (assignment: Partial<Assignment> & { id: string }) => Promise<void>;
  onClearAssignment: (assignmentId: string) => Promise<void>;
}

export default function AssignmentTable({ assignments, supervisors, onUpdateAssignment, onClearAssignment }: AssignmentTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">CTPACKER ID</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Packer/Picker Name</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.length > 0 ? (
            assignments.map(assignment => (
              <AssignmentRow
                key={assignment.id}
                assignment={assignment}
                supervisors={supervisors}
                onUpdateAssignment={onUpdateAssignment}
                onClearAssignment={onClearAssignment}
              />
            ))
          ) : (
            <TableRow>
              <td colSpan={5} className="h-24 text-center">
                No results found for your search.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
