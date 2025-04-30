'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateServicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    service_name: '',
    duration: '',
    cost: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/services/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success('Service created!');
      router.push('/dashboard');
    } else {
      toast.error(data.error || 'Failed to create service');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="service_name"
          placeholder="Service Name"
          value={form.service_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Service
        </button>
      </form>
    </div>
  );
}
