'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/current-user');
      const data = await res.json();
      if (data.success) {
        setForm({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          role: data.user.role || ''
        });
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/update-user', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Account updated');
    } else {
      toast.error(data.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirm) return;

    const res = await fetch('/api/delete-account', {
      method: 'POST',
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Account deleted');
      router.push('/');
    } else {
      toast.error(data.message || 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Role"
          value={form.role}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </form>

      <hr className="my-6" />

      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded w-full"
      >
        Delete Account
      </button>
    </div>
  );
}
