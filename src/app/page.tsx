"use client";

import DashboardClient from '@/components/dashboard/dashboard-client';
import { fetchServerData } from '@/lib/server';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data?.session) {
          setIsAuthenticated(true);
          router.replace('/dashboard');
        }
      } catch (e) {
        console.error('[page] session check failed', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const endpoint = isSignup ? '/api/signup' : '/api/signin';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setMessage(isSignup ? 'Signup successful! Please check your email.' : 'Sign-in successful!');
      setEmail('');
      setPassword('');

      // Redirect to dashboard after successful sign-in
      if (!isSignup) {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  if (isAuthenticated) {
    return <DashboardClient />; // Render the DashboardClient component when authenticated
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSignup ? 'Sign Up' : 'Sign In'}
        </button>

        {message && <p className="mt-2 text-sm text-red-600">{message}</p>}

        <p className="text-sm text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-indigo-600 hover:underline"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </main>
  );
}
