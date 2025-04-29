'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogoutPage() {
  const router = useRouter();

  const logout = async () => {
    const res = await fetch('/api/logout', { method: 'POST' });

    if (res.redirected) {
      toast.success('Logged out successfully!');
      router.push(res.url);
    } else {
      toast.error('Failed to log out.');
    }
  };

  logout();

  return null;
}
