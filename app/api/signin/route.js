import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // ✅ make sure you have this imported

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    const [users] = await connection.execute(
      'SELECT * FROM Users WHERE email = ? AND password_hash = ?',
      [email, password]
    );

    await connection.end();

    if (users.length > 0) {
      const user = users[0];

      // ✅ FIX: Await cookies()
      const cookieStore = await cookies();
      cookieStore.set('user_session', JSON.stringify({
        id: user.user_id,
        name: user.name,
        email: user.email,
      }));

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials!' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Something went wrong' });
  }
}
