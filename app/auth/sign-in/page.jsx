'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/signin', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success('Login successful!');
      router.push('/dashboard');
      router.refresh(); // forces header/user info to reload
    } else {
      toast.error(data.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
