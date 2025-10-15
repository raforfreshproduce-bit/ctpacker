"use client"

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, UserPlus, Search } from 'lucide-react';
import type { Assignment, Supervisor } from '@/lib/data';
import QuickAssignModal from './quick-assign-modal';
import AddSupervisorModal from './add-supervisor-modal';
import { useState } from 'react';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  supervisors: Supervisor[];
  assignments: Assignment[];
  onAddSupervisor: (name: string) => void;
  onRemoveSupervisor: (id: string) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
}

export default function DashboardHeader({
  searchTerm,
  onSearchChange,
  supervisors,
  assignments,
  onAddSupervisor,
  onRemoveSupervisor,
  onUpdateAssignment
}: DashboardHeaderProps) {
  const [quickAssignOpen, setQuickAssignOpen] = useState(false);
  const [addSupervisorOpen, setAddSupervisorOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by ID, Supervisor, Packer, or Status..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="w-full md:w-auto" onClick={() => setQuickAssignOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Quick Assign Slot
          </Button>
          <Button variant="outline" className="w-full md:w-auto" onClick={() => setAddSupervisorOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Supervisor
          </Button>
        </div>
      </div>
      <QuickAssignModal
        isOpen={quickAssignOpen}
        setIsOpen={setQuickAssignOpen}
        supervisors={supervisors}
        assignments={assignments}
        onUpdateAssignment={onUpdateAssignment}
      />
      <AddSupervisorModal
        isOpen={addSupervisorOpen}
        setIsOpen={setAddSupervisorOpen}
        supervisors={supervisors}
        onAddSupervisor={onAddSupervisor}
        onRemoveSupervisor={onRemoveSupervisor}
      />
    </>
  );
}
