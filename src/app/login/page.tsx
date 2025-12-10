'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log('Attempting login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error);
        setError(`Login failed: ${error.message}`);
      } else {
        console.log('Login successful, persisting session...');
        const { error: sessionError } = await supabase.auth.refreshSession();
        if (sessionError) {
          console.error('Session persistence error:', sessionError);
          setError('Failed to persist session. Please try again.');
        } else {
          console.log('Session persisted, redirecting...');
          router.push('/');
        }
      }
    } catch (e: any) {
      console.error('Login exception:', e);
      setError(`Login error: ${e?.message ?? String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input className="mt-1 block w-full rounded border px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="rudiwitboi@example.com" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 block w-full rounded border px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        </label>
        <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <p className="mt-4 text-sm text-muted-foreground">Enter your credentials to access the CTPacker Tracker.</p>
      </form>
    </div>
  );
}
