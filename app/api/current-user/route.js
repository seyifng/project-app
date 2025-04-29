import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); // ✅ Await it!

  const userSession = cookieStore.get('user_session');

  if (!userSession) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({
    success: true,
    user: JSON.parse(userSession.value),
  });
}
