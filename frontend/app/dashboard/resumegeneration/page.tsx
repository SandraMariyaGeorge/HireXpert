"use client"; // Add this directive since we're using client-side features

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingOverlayComponent from "@/components/loading-overlay";
import Dashboard_Header from "@/components/dashboard_header";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import axios from "axios";

export default function ResumeGenerationPage() {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleResumeGenerationClick = async () => {
    setLoading(true);
    try {
      const jobDesc = "Backend Engineer"; // Replace with actual job description input
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.post(
        "http://127.0.0.1:8000/generate",
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