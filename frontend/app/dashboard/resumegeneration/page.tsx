"use client"; // Add this directive since we're using client-side features

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingOverlayComponent from "@/components/loading-overlay";
import Dashboard_Header from "@/components/dashboard_header";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";

export default function ResumeGenerationPage() {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
            <Dashboard_Header toggleSidebar={toggleSidebar} />
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4">Resume Generation</h1>
                    <p className="text-gray-600 mb-6">
                    Click the button below to generate your resume. This process may take a few moments.
                    </p>
                    <Button
                    onClick={handleResumeGenerationClick}
                    disabled={loading}
                    className="w-full black black-300 text-white font-semibold py-2 rounded"
                    >
                    {loading ? "Generating..." : "Generate Resume"}
                    </Button>
                </div>

                {/* Show loading overlay when loading is true */}
                {loading && <LoadingOverlayComponent />}
                </div>
          </div>
    </div>
  );
}