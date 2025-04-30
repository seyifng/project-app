import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { serviceId, date, time, name, email, additionalInfo } = await request.json();

    const cookieStore = await cookies();
    const userSession = await cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ success: false, message: 'Not authenticated.' });
    }

    const user = JSON.parse(userSession.value);

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    await connection.execute(
      'INSERT INTO Appointment (date, time, status, user_id, service_id) VALUES (?, ?, ?, ?, ?)',
      [date, time, 'scheduled', user.id, serviceId]
    );

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Booking failed' });
  }
}
