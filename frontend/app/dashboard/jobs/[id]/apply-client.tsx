"use client";

import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import type { Job } from '@/lib/types';
import Dashboard_Sidebar from '@/components/dashboard_sidebar';
import Dashboard_Header from '@/components/dashboard_header';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ApplyPageClient({ job }: { job?: Job }) {
      const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
    const { id } = useParams(); // Get the job ID from the URL

    useEffect(() => {
        if (!id) return; // If no ID is present, do nothing

        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/job/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setJobDesc(String(data)); // Convert the fetched data to a string
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };

        fetchJobDetails();
    }, [id]);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  console.log(job);


  const handleResumeGenerationClick = async () => {
          if (!id) {
              alert("Job ID is not available");
              return;
          }
  
          setLoading(true);
          try {
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

  const handleMockInterview = () => {
    router.push('/dashboard/mockquestions');
  };

  const handleApply = () => {
    if (job?.id) {
      window.location.href = `https://jobs.careers.microsoft.com/global/en/job/${job.id}`;
    } else {
      alert('Job ID not available.');
    }
  };

  
  if (!job) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">Job Not Found</h1>
        <p className="text-gray-400 mb-8">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="dashboard/jobs">
          <Button className="bg-gray-800 text-white">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Dashboard_Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {/* Header */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Dashboard_Header toggleSidebar={toggleSidebar} />
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link href="/dashboard/jobs">
                <Button variant="ghost" className="mb-4 text-gray-400">← Back to Jobs</Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-100">{job.metadata.title}</h1>
              <p className="text-gray-400 mt-2">{job.metadata.location}</p>
              <details className="mt-4">
                <summary className="text-gray-400 cursor-pointer">Job Details</summary>
                <p className="text-gray-400 mt-2">{job.description}</p>
                <p className="text-gray-400 mt-2"><strong>Qualifications:</strong> {job.metadata.qualification}</p>
                <p className="text-gray-400 mt-2"><strong>Responsibilities:</strong> {job.metadata.responsibilities}</p>
              </details>
            </div>

            <Tabs defaultValue="resume" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resume" className="text-gray-100 bg-gray-800 hover:bg-gray-700 rounded-t-lg py-2">Customize Resume</TabsTrigger>
                <TabsTrigger value="practice" className="text-gray-100 bg-gray-800 hover:bg-gray-700 rounded-t-lg py-2">Practice Mock Interview</TabsTrigger>
              </TabsList>

              <TabsContent value="resume">
                <Card className="bg-gray-900 shadow-lg rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-100 text-2xl">Customize Your Resume</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <Button onClick={handleResumeGenerationClick}
                                        disabled={loading}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">Download Customized Resume</Button>
                      <Button onClick={handleApply} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">Apply for Job</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="practice">
                <Card className="bg-gray-900 shadow-lg rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-100 text-2xl">Practice Mock Interview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center mt-6">
                      <Button onClick={handleMockInterview} className="w-full max-w-xs bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">Practice Mock Interview</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}