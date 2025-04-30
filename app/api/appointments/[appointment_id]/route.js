import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function DELETE(request, context) {
  const { appointment_id } = await context.params; // 👈 Await added here

  try {
    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    await connection.execute('DELETE FROM Notification WHERE appointment_id = ?', [appointment_id]);
    await connection.execute('DELETE FROM Appointment WHERE appointment_id = ?', [appointment_id]);

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete appointment' }, { status: 500 });
  }
}
