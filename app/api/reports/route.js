import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: 'No report ID provided.' }, { status: 400 });
  }

  const connection = await mysql.createConnection({
    host: process.env.CMSC408_HW8_HOST,
    user: process.env.CMSC408_HW8_USER,
    password: process.env.CMSC408_HW8_PASSWORD,
    database: process.env.CMSC408_HW8_DB_NAME,
  });

  const queries = {
    1: 'SELECT user_id, name, email, role FROM Users ORDER BY user_id DESC LIMIT 50',
    2: 'SELECT * FROM Appointment ORDER BY date DESC LIMIT 50',
    3: 'SELECT * FROM Service ORDER BY cost DESC LIMIT 50',
    4: 'SELECT COUNT(*) as total_users FROM Users',
    5: 'SELECT COUNT(*) as total_appointments FROM Appointment',
    6: `SELECT s.service_name, COUNT(a.appointment_id) as total_bookings
        FROM Appointment a
        JOIN Service s ON a.service_id = s.service_id
        GROUP BY a.service_id
        ORDER BY total_bookings DESC
        LIMIT 1`,
    7: `SELECT s.service_name, AVG(TIMESTAMPDIFF(MINUTE, a.date, a.date)) as avg_duration
        FROM Appointment a
        JOIN Service s ON a.service_id = s.service_id
        GROUP BY a.service_id
        LIMIT 50`,
    8: `SELECT a.*, u.name as client_name, s.service_name
        FROM Appointment a
        JOIN Users u ON a.user_id = u.user_id
        JOIN Service s ON a.service_id = s.service_id
        WHERE a.status = 'scheduled'
        ORDER BY a.date DESC
        LIMIT 50`,
    9: `SELECT a.*, u.name as client_name
        FROM Appointment a
        JOIN Users u ON a.user_id = u.user_id
        WHERE a.status = 'canceled'
        ORDER BY a.date DESC
        LIMIT 50`,
    10: `SELECT DISTINCT s.specialization
         FROM Provider s
         ORDER BY s.specialization`,
    11: `SELECT s.service_name, s.cost
         FROM Service s
         WHERE s.cost > 100
         ORDER BY s.cost DESC`,
    12: `SELECT u.name, u.email, COUNT(a.appointment_id) as appointment_count
         FROM Users u
         JOIN Appointment a ON u.user_id = a.user_id
         GROUP BY u.user_id
         HAVING appointment_count > 1
         LIMIT 50`,
    13: `SELECT s.service_name, s.duration
         FROM Service s
         WHERE s.duration BETWEEN 30 AND 60
         LIMIT 50`,
    14: `SELECT u.name, a.date, a.time
         FROM Appointment a
         JOIN Users u ON a.user_id = u.user_id
         WHERE a.date > CURRENT_DATE()
         ORDER BY a.date ASC
         LIMIT 50`,
    15: `SELECT COUNT(*) as unread_notifications
         FROM Notification
         WHERE status = 'unread'`,
    16: `SELECT u.name, COUNT(n.notification_id) as notifications_sent
         FROM Notification n
         JOIN Users u ON n.user_id = u.user_id
         GROUP BY u.user_id
         ORDER BY notifications_sent DESC
         LIMIT 10`,
    17: `SELECT s.service_name, COUNT(DISTINCT a.user_id) as distinct_clients
         FROM Appointment a
         JOIN Service s ON a.service_id = s.service_id
         GROUP BY a.service_id
         ORDER BY distinct_clients DESC
         LIMIT 10`,
    18: `SELECT p.provider_name, COUNT(s.service_id) as services_offered
         FROM Provider p
         JOIN Service s ON p.provider_id = s.provider_id
         GROUP BY p.provider_id
         LIMIT 10`,
    19: `SELECT DATE(a.date) as appointment_day, COUNT(*) as appointments
         FROM Appointment a
         GROUP BY appointment_day
         ORDER BY appointment_day DESC
         LIMIT 10`,
    20: `SELECT s.service_name, AVG(s.cost) as average_cost
         FROM Service s
         GROUP BY s.service_name
         LIMIT 10`
  };

  const sql = queries[id];

  if (!sql) {
    await connection.end();
    return NextResponse.json({ success: false, message: 'Invalid report ID.' }, { status: 400 });
  }

  try {
    const [results] = await connection.execute(sql);
    await connection.end();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Report Query Error:', error);
    await connection.end();
    return NextResponse.json({ success: false, message: 'Query failed.' }, { status: 500 });
  }
}
