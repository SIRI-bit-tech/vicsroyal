'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck } from 'lucide-react';

export default function RegisterAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/admin/register')
      .then((res) => res.json())
      .then((data) => {
        if (data.isLocked) {
          setIsLocked(true);
          router.replace('/auth/admin/login');
        } else {
          setIsLocked(false);
        }
      })
      .catch(() => setIsLocked(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  if (isLocked === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-gray-400">
        Checking setup status...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border-2 border-[#2B0A1F] rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#2B0A1F] border border-[#E6007E] flex items-center justify-center text-[#FF4FA0] mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Initial Admin Setup</h1>
          <p className="text-xs text-gray-400 mt-1">Create the single admin owner account.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vicroyalbeauty.com"
              className="w-full px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white focus:outline-none focus:border-[#E6007E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Secure Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#2B0A1F]/40 border border-[#2B0A1F] text-white focus:outline-none focus:border-[#E6007E]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold shadow-xl hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating Owner Account...' : 'Complete Setup & Enter Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
