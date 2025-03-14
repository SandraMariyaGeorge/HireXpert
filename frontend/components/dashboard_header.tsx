// src/components/Header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  toggleSidebar: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export default function Dashboard_Header({ toggleSidebar, setIsDialogOpen }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between bg-black p-4 text-white">
      <div className="flex items-center space-x-4">
        <Button className="bg-black-500 hover:bg-black-400 p-2 rounded-full" onClick={toggleSidebar}>
          <Menu className="text-white" />
        </Button>
        <h1 className="text-2xl font-semibold text-white">Welcome to HireExpert</h1>
      </div>
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
        <User className="w-5 h-6 text-white" />
        Logged User
        <Button className="bg-white-400 hover:bg-white p-2 rounded-full" onClick={() => router.push("/")}>
          <LogOut className="text-white" />
        </Button>
      </div>
    </div>
  );
}