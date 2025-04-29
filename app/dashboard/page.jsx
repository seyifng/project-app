'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // If you have a Button component

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear session storage (if you are saving anything) and redirect to home/login
    // Example: You might add localStorage.clear() or a real logout API call if you implement sessions later.
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard!</h1>
      <p className="text-gray-600 mb-6">You have successfully signed in.</p>
      <Button onClick={handleLogout}>Log Out</Button>
    </div>
  );
}
