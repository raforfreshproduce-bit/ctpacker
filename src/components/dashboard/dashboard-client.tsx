'use client';

import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { subscribeToTableChanges, supabase } from '@/lib/supabase-client';

interface Assignment {
  id: string | number;
  name: string;
  // Define other properties of your assignment object here
}

export default function DashboardClient(): JSX.Element {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[DashboardClient] Component mounted');

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[auth] Event: ${event}`, session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        // Fetch assignments only if a user is logged in
        if (currentUser) {
          console.log('[DashboardClient] User logged in:', currentUser.email);
          await fetchAssignments();
        } else {
          console.log('[DashboardClient] User logged out');
          setAssignments([]);
        }
      }
    );

    // Fetch initial assignments
    const fetchAssignments = async () => {
      console.log('[DashboardClient] Fetching assignments');
      const { data, error } = await supabase.from('assignments').select('*'); // RLS should protect this
      if (error) {
        console.error('[DashboardClient] Failed to fetch assignments:', error);
      } else {
        setAssignments(data || []);
        console.log('[DashboardClient] Fetched assignments:', data);
      }
    };

    // Subscribe to real-time updates
    const unsubscribe = subscribeToTableChanges('assignments', (payload) => {
      console.log('[DashboardClient] Real-time update received:', payload);
      // Only process real-time updates if a user is logged in
      if (user) {
        setAssignments((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new];
          if (payload.eventType === 'UPDATE') return prev.map((item) => (item.id === payload.new.id ? payload.new : item));
          if (payload.eventType === 'DELETE') return prev.filter((item) => item.id !== payload.old.id);
          return prev;
        });
      }
    });

    return () => {
      console.log('[DashboardClient] Component unmounted');
      unsubscribe(); // Call the cleanup function directly
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    console.log('[DashboardClient] Logging out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[DashboardClient] Logout failed:', error);
    } else {
      console.log('[DashboardClient] User logged out successfully');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading user information...</p>
      ) : user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>{assignment.name}</li>
        ))}
      </ul>
    </div>
  );
}
