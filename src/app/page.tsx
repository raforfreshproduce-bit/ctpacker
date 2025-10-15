"use client";

import { useState, useMemo } from 'react';
import type { Assignment, Supervisor } from '@/lib/data';
import { initialAssignments, initialSupervisors, CTPACKER_SLOTS } from '@/lib/data';
import KpiCards from '@/components/dashboard/kpi-cards';
import DashboardHeader from '@/components/dashboard/header';
import AssignmentTable from '@/components/dashboard/assignment-table';

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [searchTerm, setSearchTerm] = useState('');

  const assignedSlots = useMemo(() => assignments.filter(a => a.packerPickerName).length, [assignments]);
  const vacantSlots = CTPACKER_SLOTS - assignedSlots;

  const handleAddSupervisor = (name: string) => {
    const newSupervisor: Supervisor = {
      id: (supervisors.length + 1).toString(),
      name: name.toUpperCase(),
    };
    setSupervisors(prev => [...prev, newSupervisor]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(prev =>
      prev.map(a => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
  };

  const handleClearAssignment = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId ? { ...a, supervisorName: null, packerPickerName: null } : a
      )
    );
  };
  
  const filteredAssignments = useMemo(() => {
    if (!searchTerm) return assignments;
    const lowercasedFilter = searchTerm.toLowerCase();
    
    return assignments.filter(assignment => {
      const status = !assignment.packerPickerName
        ? 'vacant'
        : assignment.packerPickerName.toLowerCase().includes('recount')
        ? 'psi recount'
        : 'assigned';

      return (
        assignment.id.toLowerCase().includes(lowercasedFilter) ||
        (assignment.supervisorName && assignment.supervisorName.toLowerCase().includes(lowercasedFilter)) ||
        (assignment.packerPickerName && assignment.packerPickerName.toLowerCase().includes(lowercasedFilter)) ||
        status.includes(lowercasedFilter)
      );
    });
  }, [assignments, searchTerm]);

  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-2">CTPacker Tracker</h1>
        <p className="text-muted-foreground mb-8">Real-Time Packer/Picker Assignment Registry</p>
        
        <KpiCards totalSlots={CTPACKER_SLOTS} assignedSlots={assignedSlots} vacantSlots={vacantSlots} />

        <div className="mt-8">
          <DashboardHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            supervisors={supervisors}
            assignments={assignments}
            onAddSupervisor={handleAddSupervisor}
            onUpdateAssignment={handleUpdateAssignment}
          />
          <AssignmentTable
            assignments={filteredAssignments}
            supervisors={supervisors}
            onUpdateAssignment={handleUpdateAssignment}
            onClearAssignment={handleClearAssignment}
          />
        </div>
      </div>
    </main>
  );
}
