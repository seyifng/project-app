import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('user_session');
    if (!session) return NextResponse.json({ success: false });

    const user = JSON.parse(session.value);

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    let query = '';
    let params = [];

    if (user.role === 'provider') {
      query = `
        SELECT 
          a.*, u.name AS client_name, u.email AS client_email
        FROM Appointment a
        JOIN Users u ON a.user_id = u.user_id
        JOIN Service s ON a.service_id = s.service_id
        WHERE s.provider_id = ?
        ORDER BY a.date, a.time
      `;
      params = [user.id];
    } else {
      query = `
        SELECT a.*, s.service_name
        FROM Appointment a
        JOIN Service s ON a.service_id = s.service_id
        WHERE a.user_id = ?
        ORDER BY a.date, a.time
      `;
      params = [user.id];
    }

    const [appointments] = await connection.execute(query, params);
    await connection.end();

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error('Dashboard appointments error:', error);
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}
