import mysql from 'mysql2/promise';

export async function POST(req) {
  const { name, email, phone, password, role } = await req.json();

  try {
    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM Users WHERE phone = ? OR email = ?',
      [phone, email]
    );

    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: 'User already exists.' }), { status: 400 });
    }

    // Insert new user
    await connection.execute(
      'INSERT INTO Users (name, phone, password_hash, role, email) VALUES (?, ?, ?, ?, ?)',
      [name, phone, password, role, email]
    );

    await connection.end();

    return new Response(JSON.stringify({ message: 'User created successfully!' }), { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
  }
}
