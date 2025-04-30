'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Button } from '@/components/ui/button';

export default function AppointmentBookingPage() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) setServices(data.services);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedService || !selectedDate) return;
      const res = await fetch(
        `/api/availability?service_id=${selectedService}&date=${format(selectedDate, 'yyyy-MM-dd')}`
      );
      const data = await res.json();
      if (data.success) {
        setAvailableSlots(data.slots || []);
      } else {
        setAvailableSlots([]); // Always reset if API fails
      }
      
    };
    fetchSlots();
  }, [selectedService, selectedDate]);

  const handleSubmit = async () => {
    const res = await fetch('/api/appointments/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: selectedService,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Appointment booked successfully!');
      setAvailableSlots((prev) => prev.filter((slot) => slot !== selectedTime));
    } else {
      setMessage('Error booking appointment.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>

      <select
        className="w-full mb-4 p-2 border rounded"
        onChange={(e) => {
          setSelectedService(e.target.value);
          setAvailableSlots([]);
          setSelectedTime(null);
        }}
      >
        <option value="">Select a Service</option>
        {services.map((service) => (
          <option key={service.service_id} value={service.service_id}>
            {service.service_name}
          </option>
        ))}
      </select>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={{ before: new Date() }}
      />

      {availableSlots.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 font-semibold">Available Time Slots:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedTime === slot ? 'default' : 'outline'}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedTime && (
        <div className="mt-6">
          <Button onClick={handleSubmit}>Confirm Appointment</Button>
        </div>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
