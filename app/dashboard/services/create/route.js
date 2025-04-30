import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { service_name, duration, cost } = await req.json();

    const cookieStore = cookies();
    const session = cookieStore.get('user_session');

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(session.value);
    
    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    // Verify user is a provider
    const [users] = await connection.execute(
      'SELECT * FROM Users WHERE user_id = ? AND role = "provider"',
      [user.id]
    );

    if (users.length === 0) {
      await connection.end();
      return NextResponse.json({ success: false, error: 'Only providers can create services' }, { status: 403 });
    }

    // Insert into Service table
    await connection.execute(
      'INSERT INTO Service (service_name, duration, cost, provider_id) VALUES (?, ?, ?, ?)',
      [service_name, duration, cost, user.id]
    );

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
