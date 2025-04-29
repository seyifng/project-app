'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UserMenu = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" });
    const data = await res.json();

    if (data.success) {
      toast.success("Successfully logged out.");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Logout failed.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 hover:opacity-90 transition">
          <Avatar>
            <AvatarImage src="/logo.png" alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/account")}>
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
