"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Assignment, Supervisor } from '@/lib/data';
import { initialAssignments, initialSupervisors, CTPACKER_SLOTS } from '@/lib/data';
import KpiCards from '@/components/dashboard/kpi-cards';
import DashboardHeader from '@/components/dashboard/header';
import Footer from '@/components/dashboard/footer';
import AssignmentTable from '@/components/dashboard/assignment-table';

const ASSIGNMENTS_STORAGE_KEY = 'ctpacker-assignments';
const SUPERVISORS_STORAGE_KEY = 'ctpacker-supervisors';

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    // This function runs only on the initial render.
    // We can't use localStorage directly here because of server-side rendering.
    // We'll load from localStorage in a useEffect hook.
    return initialAssignments;
  });
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [searchTerm, setSearchTerm] = useState('');

  // Load state from localStorage on initial client-side render
  useEffect(() => {
    const storedAssignments = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    }
    const storedSupervisors = localStorage.getItem(SUPERVISORS_STORAGE_KEY);
    if (storedSupervisors) {
      setSupervisors(JSON.parse(storedSupervisors));
    }
  }, []);

  const assignedSlots = useMemo(() => assignments.filter(a => a.packerPickerName).length, [assignments]);
  const vacantSlots = CTPACKER_SLOTS - assignedSlots;

  const handleAddSupervisor = (name: string) => {
    const newSupervisor: Supervisor = {
      id: (supervisors.length + 1).toString(),
      name: name.toUpperCase(),
    };
    setSupervisors(prev => {
      const newSupervisors = [...prev, newSupervisor];
      localStorage.setItem(SUPERVISORS_STORAGE_KEY, JSON.stringify(newSupervisors));
      return newSupervisors;
    });
  };

  const handleRemoveSupervisor = (supervisorId: string) => {
    const supervisorToRemove = supervisors.find(s => s.id === supervisorId);
    if (!supervisorToRemove) return;

    // Remove supervisor from the list
    const newSupervisors = supervisors.filter(s => s.id !== supervisorId);
    setSupervisors(newSupervisors);
    localStorage.setItem(SUPERVISORS_STORAGE_KEY, JSON.stringify(newSupervisors));

    // Un-assign the removed supervisor from any slots
    setAssignments(prev => {
      const newAssignments = prev.map(a =>
        a.supervisorName === supervisorToRemove.name ? { ...a, supervisorName: null } : a
      );
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(newAssignments));
      return newAssignments;
    });
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(prev => {
      const newAssignments = prev.map(a => (a.id === updatedAssignment.id ? updatedAssignment : a));
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(newAssignments));
      return newAssignments;
    });
  };

  const handleClearAssignment = (assignmentId: string) => {
    setAssignments(prev => {
      const newAssignments = prev.map(a =>
        a.id === assignmentId ? { ...a, supervisorName: null, packerPickerName: null } : a
      );
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(newAssignments));
      return newAssignments;
    });
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
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">CTPacker Tracker</h1>
        <p className="text-muted-foreground mb-8">Real-Time Packer/Picker Assignment Registry</p>
        
        <KpiCards totalSlots={CTPACKER_SLOTS} assignedSlots={assignedSlots} vacantSlots={vacantSlots} />

        <div className="mt-8">
          <DashboardHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            supervisors={supervisors}
            assignments={assignments}
            onAddSupervisor={handleAddSupervisor}
            onRemoveSupervisor={handleRemoveSupervisor}
            onUpdateAssignment={handleUpdateAssignment}
          />
          <div className="overflow-x-auto">
            <AssignmentTable
              assignments={filteredAssignments}
              supervisors={supervisors}
              onUpdateAssignment={handleUpdateAssignment}
              onClearAssignment={handleClearAssignment}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
