import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from 'mysql2/promise';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const userSession = await cookieStore.get('user_session');
    if (!userSession) {
      return NextResponse.json({ success: false, message: 'Not authenticated' });
    }

    const user = JSON.parse(userSession.value);
    if (user.role !== 'provider') {
      return NextResponse.json({ success: false, message: 'Only providers can set availability' });
    }

    const { availability } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    // Optional: clear existing availability for provider
    await connection.execute(
      'DELETE FROM Availability WHERE provider_id = ?',
      [user.id]
    );

    // Insert new availability entries
    for (const date in availability) {
      for (const time of availability[date]) {
        await connection.execute(
          'INSERT INTO Availability (provider_id, date, time) VALUES (?, ?, ?)',
          [user.id, date, time]
        );
      }
    }

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Availability save error:', error);
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}
