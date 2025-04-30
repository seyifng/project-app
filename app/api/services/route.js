import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    const [services] = await connection.execute(
      'SELECT service_id, service_name, duration, cost FROM Service'
    );

    await connection.end();

    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error('Service fetch error:', error);
    return NextResponse.json({ success: false, message: 'Error fetching services' }, { status: 500 });
  }
}
