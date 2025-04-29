// app/api/logout/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set('user_session', '', { maxAge: 0 });

  return NextResponse.redirect('http://localhost:3000/');
}
