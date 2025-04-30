'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function NewServicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    service_name: '',
    duration: '',
    cost: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/services/new', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      toast.success('Service created successfully!');
      router.push('/dashboard'); // Redirect after creating
      router.refresh();
    } else {
      toast.error(data.message || 'Failed to create service.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Service Name"
          required
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, service_name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration (in minutes)"
          required
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cost ($)"
          required
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />
        <Button type="submit" className="w-full">
          Create Service
        </Button>
      </form>
    </div>
  );
}
