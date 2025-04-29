import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Header() {
  const cookieStore = await cookies(); // ✅ await required
  const session = cookieStore.get('user_session');
  const user = session ? JSON.parse(session.value) : null;

  return (
    <nav className="flex justify-between p-4 shadow">
      <Link href="/">Home</Link>
      <div className="flex gap-4">
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <form action="/api/logout" method="POST">
              <button type="submit">Logout</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/sign-in">Login</Link>
            <Link href="/auth/sign-up">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
