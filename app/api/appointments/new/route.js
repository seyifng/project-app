import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { date, time, service_id } = await request.json();

    const cookieStore = await cookies();
    const userSession = await cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ success: false, message: 'Not logged in.' });
    }

    const user = JSON.parse(userSession.value);

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    // ✅ 1. Find provider for this service
    const [services] = await connection.execute(
      'SELECT provider_id FROM Service WHERE service_id = ?',
      [service_id]
    );

    if (services.length === 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: 'Service not found.' });
    }

    const providerId = services[0].provider_id;

    // ✅ 2. Create appointment
    const [appointmentResult] = await connection.execute(
      'INSERT INTO Appointment (date, time, status, user_id, service_id) VALUES (?, ?, ?, ?, ?)',
      [date, time, 'scheduled', user.id, service_id]
    );

    const appointmentId = appointmentResult.insertId;

    // ✅ 3. Record the booked slot
    await connection.execute(
      'INSERT INTO BookedSlots (provider_id, service_id, date, time) VALUES (?, ?, ?, ?)',
      [providerId, service_id, date, time]
    );

    // ✅ 4. Send Notification
    const message = `New appointment scheduled for ${date} at ${time}`;
    const timestamp = new Date();

    await connection.execute(
      'INSERT INTO Notification (message, status, timestamp, user_id, appointment_id) VALUES (?, ?, ?, ?, ?)',
      [message, 'unread', timestamp, user.id, appointmentId]
    );

    await connection.end();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json({ success: false, message: 'Error creating appointment' });
  }
}
