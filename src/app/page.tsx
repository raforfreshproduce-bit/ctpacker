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
  const [localAssignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [localSupervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [searchTerm, setSearchTerm] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Ensure hydration consistency
  useEffect(() => {
    console.log('Hydration started'); // Debugging log
    setHydrated(true);
    console.log('Hydration complete'); // Debugging log
  }, []);

  // Fetch data client-side on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data'); // Debugging log
        const assignments = await fetch('https://lghwfatkiwixgzsmdzuk.supabase.co/rest/v1/assignments', {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }).then(res => res.json());

        const supervisors = await fetch('https://lghwfatkiwixgzsmdzuk.supabase.co/rest/v1/supervisors', {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }).then(res => res.json());

        console.log('Data fetched:', { assignments, supervisors }); // Debugging log
        setAssignments(assignments);
        setSupervisors(supervisors);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const assignedSlots = useMemo(() => {
    console.log('Calculating assigned slots'); // Debugging log
    return localAssignments.filter(a => a.packerPickerName).length;
  }, [localAssignments]);

  const vacantSlots = CTPACKER_SLOTS - assignedSlots;

  const handleAddSupervisor = (name: string) => {
    const newSupervisor: Supervisor = {
      id: (localSupervisors.length + 1).toString(),
      name: name.toUpperCase(),
    };
    setSupervisors(prev => {
      const newSupervisors = [...prev, newSupervisor];
      localStorage.setItem(SUPERVISORS_STORAGE_KEY, JSON.stringify(newSupervisors));
      return newSupervisors;
    });
  };

  const handleRemoveSupervisor = (supervisorId: string) => {
    const supervisorToRemove = localSupervisors.find(s => s.id === supervisorId);
    if (!supervisorToRemove) return;

    // Remove supervisor from the list
    const newSupervisors = localSupervisors.filter(s => s.id !== supervisorId);
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
    console.log('Filtering assignments'); // Debugging log
    if (!searchTerm) return localAssignments;
    const lowercasedFilter = searchTerm.toLowerCase();

    return localAssignments.filter(assignment => {
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
  }, [localAssignments, searchTerm]);

  if (!hydrated) {
    console.log('Waiting for hydration'); // Debugging log
    return null; // Avoid rendering until hydration is complete
  }

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
            supervisors={localSupervisors}
            assignments={localAssignments}
            onAddSupervisor={handleAddSupervisor}
            onRemoveSupervisor={handleRemoveSupervisor}
            onUpdateAssignment={handleUpdateAssignment}
          />
          <div className="overflow-x-auto">
            <AssignmentTable
              assignments={filteredAssignments}
              supervisors={localSupervisors}
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
