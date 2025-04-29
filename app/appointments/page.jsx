'use client';

import React, { useEffect, useState } from 'react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();

        if (data.success) {
          setAppointments(data.appointments);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.appointment_id} className="border p-4 rounded">
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <p><strong>Status:</strong> {appt.status}</p>
              <p><strong>Service:</strong> {appt.service}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
