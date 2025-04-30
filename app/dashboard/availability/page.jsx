'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const fetchAvailability = async () => {
      const res = await fetch('/api/availability');
      const data = await res.json();
      if (data.success && data.availability) {
        setAvailability(data.availability);
      }
    };
    fetchAvailability();
  }, []);

  const handleToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day]?.isAvailable,
      }
    }));
  };

  const handleChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/availability', {
      method: 'POST',
      body: JSON.stringify(availability),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Availability updated!');
    } else {
      toast.error(data.message || 'Error updating availability.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Set Your Availability</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {daysOfWeek.map(day => (
          <div key={day} className="border p-4 rounded space-y-2">
            <label className="font-semibold capitalize">{day}</label>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={availability[day]?.isAvailable || false}
                onChange={() => handleToggle(day)}
              />
              <input
                type="time"
                value={availability[day]?.startTime || ''}
                onChange={(e) => handleChange(day, 'startTime', e.target.value)}
                disabled={!availability[day]?.isAvailable}
                className="border p-2 rounded"
              />
              <input
                type="time"
                value={availability[day]?.endTime || ''}
                onChange={(e) => handleChange(day, 'endTime', e.target.value)}
                disabled={!availability[day]?.isAvailable}
                className="border p-2 rounded"
              />
            </div>
          </div>
        ))}
        <Button type="submit" className="w-full">Save Availability</Button>
      </form>
    </div>
  );
}
