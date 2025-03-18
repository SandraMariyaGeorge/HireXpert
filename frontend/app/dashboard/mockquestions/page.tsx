"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";
import LoadingOverlayComponent from "@/components/loading-overlay";
import Link from "next/link";

const handleRouting = (router: ReturnType<typeof useRouter>, path: string) => {
    router.push(path);
  };

export default function MockQuestions() {
  
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleGenerateQuestions = () => {
    console.log("Generating questions for:", jobDescription);
  };

  const handleAttendMockInterview = () => {
    console.log("Attending mock interview for:", jobDescription);
    router.push('/dashboard/mockinterview');
  };

  const handleResumeGenerationClick = () => {
    setLoading(true);
    // Simulate a delay for the loading effect
    setTimeout(() => {
      setLoading(false);
      // Add any additional logic here if needed
    }, 2000);
  };

  return (

    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Dashboard_Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {/*Header */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Dashboard_Header toggleSidebar={toggleSidebar}/>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black">Enter Job Description</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-lg"
            placeholder="Copy and paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex space-x-4">
            <Button className="bg-blue-500 hover:bg-grey-600 text-white p-2 rounded-lg" onClick={handleGenerateQuestions}>
              Generate Questions
            </Button>
            <Link href="/dashboard/mockinterview" passHref>
            <Button className="bg-red-500 hover:bg-grey-600 text-white p-2 rounded-lg">
                Attend Mock Interview
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  </div>
  );
}

