"use client";

import { Button } from "@/components/ui/button";
import { X, Briefcase, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link"; // Import next/link for client-side navigation

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Dashboard_Sidebar({
  sidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-black text-white w-64 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">HireXpert</h2>
        <Button
          className="bg-gray-100 hover:bg-gray-300 p-2 rounded-full"
          onClick={toggleSidebar}
        >
          <X className="text-black" />
        </Button>
      </div>
      <nav className="mt-4">
        <ul>
          {/* Home Link */}
          <li className="p-3 hover:bg-gray-700">
            <Link href="/dashboard" passHref>
              <Button className="flex items-center space-x-2 w-full text-left bg-white hover:bg-gray-200 text-black">
                <Briefcase className="w-5 h-5 text-black" />
                <span>HOME</span>
              </Button>
            </Link>
          </li>
          
          {/* Mock Interview Link */}
          <li className="p-3 hover:bg-gray-700">
            <Link href="/dashboard/mockquestions" passHref>
              <Button className="flex items-center space-x-2 w-full text-left bg-white hover:bg-gray-200 text-black">
                <Briefcase className="w-5 h-5 text-black" />
                <span>Mock Interview</span>
              </Button>
            </Link>
          </li>

          {/* Job Listings Link */}
          <li className="p-3 hover:bg-gray-700">
            <Link href="/dashboard/jobs" passHref>
              <Button className="flex items-center space-x-3 w-full text-left bg-white hover:bg-gray-200 text-black">
                <Briefcase className="w-5 h-6 text-black" />
                <span>Job Listings</span>
              </Button>
            </Link>
          </li>

          {/* Resume Generation Button */}
          <li className="p-4 hover:bg-gray-700">
            <Link href="/dashboard/resumegeneration" passHref>
              <Button className="flex items-center space-x-2 w-full text-left bg-white hover:bg-gray-200 text-black">
                <FileText className="w-5 h-5 text-black" />
                <span>Resume Generation</span>
              </Button>
            </Link>
          </li>

        {/*Interview Link */}
        <li className="p-3 hover:bg-gray-700">
            <Link href="/dashboard/attend-interview" passHref>
              <Button className="flex items-center space-x-2 w-full text-left bg-white hover:bg-gray-200 text-black">
                <Briefcase className="w-5 h-5 text-black" />
                <span>Attend Interview</span>
              </Button>
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
}