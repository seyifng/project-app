'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { PenBox } from 'lucide-react';
import UserMenu from './user-menu';

export default function Header() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/current-user');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]); // Reacts to route changes (login/logout)

  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2">
      <Link href={user ? "/dashboard" : "/"} className="flex items-center">
        <Image
          src="/logo.png"
          width="150"
          height="60"
          alt="Entergalactic Logo"
          className="h-16 w-auto"
        />
    </Link>


      <div className="flex items-center gap-4">
        {user ? (
          <UserMenu user={user} />
        ) : (
          <>
            <Link href="/auth/sign-in">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
