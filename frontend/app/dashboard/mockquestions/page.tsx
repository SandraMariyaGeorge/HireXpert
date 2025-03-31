"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const handleRouting = (router: ReturnType<typeof useRouter>, path: string) => {
  router.push(path);
};

export default function MockQuestions() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = () => {
    if (jobDescription.trim()) {
      router.push(`/dashboard/mockinterview?jobDescription=${encodeURIComponent(jobDescription)}`);
    } else {
      alert("Please enter a job description before proceeding.");
    }
  };

  return (
    <div className="flex min-h-screen h-screen w-screen overflow-hidden bg-black">
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
        <div className="flex items-center justify-center h-full w-full">
          <Card className="w-full h-full bg-black text-white shadow-xl flex flex-col">
            <div className="p-4">
              <ArrowLeft className="cursor-pointer text-white hover:text-gray-400" onClick={() => router.back()} />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Enter Job Description</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 flex-1 p-8">
              <textarea
                className="w-full h-full p-4 border border-gray-300 rounded-lg bg-gray-800 text-white"
                placeholder="Copy and paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleNavigate}
                  className="bg-white text-black hover:bg-gray-300 p-2 rounded-lg"
                >
                  Attend Mock Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
