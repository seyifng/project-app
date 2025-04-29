import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");

  if (!session) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const user = JSON.parse(session.value);
  const { name, phone } = await request.json();

  try {
    const connection = await mysql.createConnection({
      host: process.env.CMSC408_HW8_HOST,
      user: process.env.CMSC408_HW8_USER,
      password: process.env.CMSC408_HW8_PASSWORD,
      database: process.env.CMSC408_HW8_DB_NAME,
    });

    await connection.execute(
      "UPDATE Users SET name = ?, phone = ? WHERE user_id = ?",
      [name, phone, user.id]
    );

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Update error:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
