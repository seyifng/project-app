import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = await cookieStore.get('user_session');

    if (!session) {
      return NextResponse.json({ success: false, message: 'Not authenticated' });
    }

    const user = JSON.parse(session.value);

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    const userId = user.id;

    // Delete related data
    await connection.execute('DELETE FROM Notification WHERE user_id = ?', [userId]);
    await connection.execute('DELETE FROM Appointment WHERE user_id = ?', [userId]);
    await connection.execute('DELETE FROM Service WHERE provider_id = ?', [userId]);
    await connection.execute('DELETE FROM Availability WHERE provider_id = ?', [userId]);
    await connection.execute('DELETE FROM Users WHERE user_id = ?', [userId]);

    await connection.end();

    const response = NextResponse.json({ success: true });
    response.cookies.set('user_session', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ success: false, message: 'Error deleting account' });
  }
}
