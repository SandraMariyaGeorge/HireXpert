"use client"; // Add this directive since we're using client-side features

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingOverlayComponent from "@/components/loading-overlay";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Dashboard_Header from "@/components/dashboard_header";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import axios from "axios";
import Link from "next/link";
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResumeGenerationPage() {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleResumeGenerationClick = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.post(
        `${BASE_URL}/generate`,
        { job_desc: jobDesc },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Ensure the response is treated as a binary file
        }
      );

      // Create a URL for the PDF file and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating resume:", error);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      <StarsBackground className="absolute inset-0 -z-10" />
      <ShootingStars className="absolute inset-0 -z-10" />
      {/* Sidebar */}
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Header */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar */}
        <Dashboard_Header toggleSidebar={toggleSidebar} />
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-5">
          <Card className="bg-gray-800 p-20 rounded-lg shadow-lg  w-full text-center m-40">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-white mb-6">Resume Generation</CardTitle>
              {/* <Link href={`/dashboard`}>
          <Button variant="ghost" className="mb-4 text-gray-400">← Back to Dashboard</Button>
              </Link> */}
            </CardHeader>
            <CardContent>
              <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Enter job description"
          className="mb-8 h-40 w-full px-8 py-6 border border-gray-600 rounded-md text-xl bg-gray-700 text-white"
              />
              <Button
                onClick={handleResumeGenerationClick}
                disabled={loading}
                className="w-full h-14 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg text-lg"
              >
                {loading ? "Generating..." : "Generate Resume"}
              </Button>
            </CardContent>
          </Card>

          {/* Show loading overlay when loading is true */}
          {loading && <LoadingOverlayComponent />}
        </div>
      </div>
    </div>
  );
}
