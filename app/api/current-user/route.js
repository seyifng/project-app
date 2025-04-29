import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const cookieStore = await cookies();  // FIX: await cookies()
  const userSession = cookieStore.get('user_session');

  if (!userSession) {
    return NextResponse.json({ success: false });
  }

  const session = JSON.parse(userSession.value);

  const connection = await mysql.createConnection({
    host: process.env.CMSC408_HW8_HOST,
    user: process.env.CMSC408_HW8_USER,
    password: process.env.CMSC408_HW8_PASSWORD,
    database: process.env.CMSC408_HW8_DB_NAME,
  });

  const [rows] = await connection.execute('SELECT user_id, name, email, phone, role FROM Users WHERE user_id = ?', [session.id]);
  await connection.end();

  if (rows.length === 0) {
    return NextResponse.json({ success: false });
  }

  const user = rows[0];

  return NextResponse.json({ success: true, user });
}
