'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function DashboardHome() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await fetch('/api/current-user');
      const userData = await userRes.json();

      if (userData.success) {
        setUser(userData.user);

        const apptRes = await fetch('/api/appointments');
        const apptData = await apptRes.json();

        if (apptData.success) {
          setAppointments(apptData.appointments);
        }
      }
    };

    fetchData();
  }, []);

  const cancelAppointment = async (appointment_id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmed) return;

    const res = await fetch(`/api/appointments/${appointment_id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (data.success) {
      toast.success('Appointment canceled.');
      setAppointments((prev) => prev.filter((appt) => appt.appointment_id !== appointment_id));
    } else {
      toast.error(data.message || 'Failed to cancel appointment.');
    }
  };

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome back, {user.name}!
      </h1>

      <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>

      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li
              key={appt.appointment_id}
              className="border p-4 rounded bg-white shadow"
            >
              <p>
                <strong>Date:</strong>{' '}
                {format(parseISO(appt.date), 'MMMM d, yyyy')}
              </p>
              <p>
                <strong>Time:</strong>{' '}
                {format(parseISO(`1970-01-01T${appt.time}`), 'h:mm a')}
              </p>
              <p>
                <strong>Status:</strong> {appt.status}
              </p>
              {user.role === 'provider' ? (
                <>
                  <p>
                    <strong>Client Name:</strong> {appt.client_name}
                  </p>
                  <p>
                    <strong>Client Email:</strong> {appt.client_email}
                  </p>
                </>
              ) : (
                <p>
                  <strong>Service:</strong>{' '}
                  {appt.service_name || `#${appt.service_id}`}
                </p>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="mt-3"
                onClick={() => cancelAppointment(appt.appointment_id)}
              >
                Cancel Appointment
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
