// src/components/Sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { X, Briefcase, FileText } from "lucide-react";
import Link from "next/link"; // Import next/link for client-side navigation

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleResumeGenerationClick: () => void;
}

export default function Dashboard_Sidebar({
  sidebarOpen,
  toggleSidebar,
  handleResumeGenerationClick,
}: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <Button
          className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
          onClick={toggleSidebar}
        >
          <X className="text-white" />
        </Button>
      </div>
      <nav className="mt-4">
        <ul>
          {/* Mock Interview Link */}
          <li className="p-3 hover:bg-gray-700">
            <Link href="/dashboard/mockquestions" passHref>
              <Button className="flex items-center space-x-2 w-full text-left">
                <Briefcase className="w-5 h-5 text-white" />
                <span>Mock Interview</span>
              </Button>
            </Link>
          </li>

          {/* Job Listings Link */}
          <li className="p-4 hover:bg-gray-700">
            <Link href="/dashboard/jobs" passHref>
              <Button className="flex items-center space-x-1 w-full text-left">
                <Briefcase className="w-3 h-3 text-white" />
                <span>Job Listings</span>
              </Button>
            </Link>
          </li>

          {/* Resume Generation Button */}
          <li className="p-4 hover:bg-gray-700">
            <Button
              className="flex items-center space-x-2 w-full text-left"
              onClick={handleResumeGenerationClick}
            >
              <FileText className="w-5 h-5 text-white" />
              <span>Resume Generation</span>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}