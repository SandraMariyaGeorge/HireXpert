"use client";

import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext"; 
import Link from "next/link";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Dashboard_Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuth(); 

  return (
    <AuthProvider>
    <div className="flex items-center justify-between bg-black p-4 text-white">
      <div className="flex items-center space-x-4">
        <Button className="bg-black-500 hover:bg-black-400 p-2 rounded-full" onClick={toggleSidebar}>
          <Menu className="text-white" />
        </Button>
        <Link href="/dashboard">
          <h1 className="text-2xl font-semibold text-white">HireExpert</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push("/dashboard/profile")}>
        <User className="w-5 h-6 text-white" />
        Logged User
        <Button className="bg-white-400 hover:bg-white p-2 rounded-full" onClick={() => logout()}>
          <LogOut className="text-white" />
        </Button>
      </div>
    </div>
    </AuthProvider>
  );
}