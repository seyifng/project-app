import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { cookies } from 'next/headers';
import { parseISO, format } from 'date-fns'; // ✅ to fix date handling

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const service_id = searchParams.get('service_id');
    const date = searchParams.get('date');

    if (!service_id || !date) {
      return NextResponse.json({ success: false, message: 'Missing service_id or date.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userSession = await cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    const [serviceRows] = await connection.execute(
      'SELECT provider_id FROM Service WHERE service_id = ?',
      [service_id]
    );

    if (serviceRows.length === 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: 'Invalid service.' }, { status: 404 });
    }

    const providerId = serviceRows[0].provider_id;

    const [availabilityRows] = await connection.execute(
      'SELECT availability_data FROM Availability WHERE provider_id = ?',
      [providerId]
    );

    await connection.end();

    if (availabilityRows.length === 0) {
      return NextResponse.json({ success: false, message: 'No availability found.' }, { status: 404 });
    }

    // ✅ availability_data is ALREADY JSON from database
    const availabilityData = availabilityRows[0].availability_data;

    if (!availabilityData) {
      return NextResponse.json({ success: false, message: 'No availability data.' });
    }

    // ✅ Correct day conversion
    const weekday = format(parseISO(date), 'EEEE').toLowerCase(); // e.g. 'monday'

    const dayAvailability = availabilityData[weekday];

    if (!dayAvailability || !dayAvailability.isAvailable) {
      return NextResponse.json({ success: true, slots: [] });
    }

    const startTime = dayAvailability.startTime;
    const endTime = dayAvailability.endTime;

    if (!startTime || !endTime) {
      return NextResponse.json({ success: true, slots: [] });
    }

    // ✅ Build slots based on 30-minute gaps
    const slots = generateTimeSlots(startTime, endTime);

    return NextResponse.json({ success: true, slots });

  } catch (error) {
    console.error('Availability fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Helper function to generate 30-min time slots
function generateTimeSlots(start, end) {
  const slots = [];
  let [startHour, startMinute] = start.split(':').map(Number);
  let [endHour, endMinute] = end.split(':').map(Number);

  while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
    const formatted = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
    slots.push(formatted);

    startMinute += 30;
    if (startMinute >= 60) {
      startMinute -= 60;
      startHour += 1;
    }
  }
  return slots;
}
