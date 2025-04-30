import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const userSession = await cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ success: false, message: 'Not authenticated' });
    }

    const user = JSON.parse(userSession.value);

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    // 🔥 Correctly check role from database
    const [users] = await connection.execute(
      'SELECT role FROM Users WHERE user_id = ?',
      [user.id]
    );

    if (users.length === 0 || users[0].role.toLowerCase() !== 'provider') {
      await connection.end();
      return NextResponse.json({ success: false, message: 'Only providers can create services' });
    }

    // ✅ Now allow service creation
    const { service_name, duration, cost } = await request.json();

    await connection.execute(
      'INSERT INTO Service (service_name, duration, cost, provider_id) VALUES (?, ?, ?, ?)',
      [service_name, duration, cost, user.id]
    );

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Something went wrong' });
  }
}
