import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const session = await cookieStore.get('user_session');

  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const user = JSON.parse(session.value);

  try {
    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    const [appointments] = await connection.execute(
      `SELECT a.appointment_id, a.date, a.time, a.status, s.name AS service
       FROM Appointment a
       JOIN Service s ON a.service_id = s.service_id
       WHERE a.user_id = ?`,
      [user.id]
    );

    await connection.end();

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Failed to load appointments' });
  }
}
