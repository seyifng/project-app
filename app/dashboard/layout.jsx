'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/current-user');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  // Common links for all users
  const links = [
    { name: "Home", href: "/dashboard" },
    { name: "Appointments", href: "/dashboard/appointments" },
    { name: "Manage Account", href: "/account" },
    { name: "Report", href: "/dashboard/reports" },
  ];

  // Provider-only links
  if (user.role === "provider") {
    links.splice(2, 0, { name: "Availability", href: "/dashboard/availability" }); // insert before Manage Account
    links.push({ name: "Add Service", href: "/dashboard/services/new" });
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col py-8 px-4 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Entergalactic</h2>
        </div>
        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-lg transition hover:bg-blue-600 ${
                  pathname === link.href ? "bg-blue-600 font-semibold" : ""
                }`}
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-10">{children}</main>
    </div>
  );
}
