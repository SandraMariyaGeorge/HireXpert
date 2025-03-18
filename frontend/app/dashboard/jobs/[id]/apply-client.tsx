"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import type { Job } from '@/lib/types';
import Dashboard_Sidebar from '@/components/dashboard_sidebar';
import Dashboard_Header from '@/components/dashboard_header';
import { useState } from 'react';

export default function ApplyPageClient({ job }: { job?: Job }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCustomizeResume = () => {
    router.push('/customize-resume');
  };

  const handleMockInterview = () => {
    router.push('/dashboard/mockinterview');
  };

  const handleApplyWithExistingResume = () => {
    if (job?.applyLink) {
      window.location.href = job.applyLink;
    } else {
      alert('Application link not available.');
    }
  };

  const handleSubmitApplication = () => {
    if (job?.applyLink) {
      window.location.href = job.applyLink;
    } else {
      alert('Application link not available.');
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
          {/*Header */}
          <div className="flex-1 flex flex-col">
            {/* Navbar */}
            <Dashboard_Header toggleSidebar={toggleSidebar}/>
            <div className="container mx-auto py-8 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Link href="/dashboard/jobs">
                    <Button variant="ghost" className="mb-4 text-gray-400">← Back to Jobs</Button>
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-600">{job.title}</h1>
                  <p className="text-gray-400 mt-2">{job.company} • {job.location}</p>
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
                          <Button onClick={handleCustomizeResume} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">Customize Resume with AI</Button>
                          <Button onClick={handleApplyWithExistingResume} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">Apply with Existing Resume</Button>
                        </div>
                        <div className="flex justify-end space-x-4">
                          <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">Save Draft</Button>
                          <Button onClick={handleSubmitApplication} className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg">Submit Application</Button>
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