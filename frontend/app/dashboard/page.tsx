'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Briefcase, FileText, MessageSquare, Menu, Bell, Search, User } from 'lucide-react';
import Dashboard_Header from '@/components/dashboard_header';
import Dashboard_Sidebar from '@/components/dashboard_sidebar';
import LoadingOverlayComponent from '@/components/loading-overlay';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const progressItems = [
    { title: 'Resume Generation', progress: 85, icon: FileText },
    { title: 'Mock Interviews', progress: 60, icon: MessageSquare },
    { title: 'Job Applications', progress: 40, icon: Briefcase },
  ];

  const interviewDetails = [
    { title: 'Interview with Google', date: 'March 20, 2025', status: 'Completed' },
    { title: 'Interview with Microsoft', date: 'March 18, 2025', status: 'Pending' },
    { title: 'Interview with Amazon', date: 'March 15, 2025', status: 'Completed' },
  ];

  return (
    <ProtectedRoute role="candidate">
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {loading && <LoadingOverlayComponent />}
      
      {/* Header */}
      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold mb-14">Welcome back, John!</h1>

    
            
            {/* Progress Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {progressItems.map((item) => (
                <Card key={item.title} className="bg-gray-200 border-gray-300 p-12">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-medium">{item.title}</h3>
                    <item.icon className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex items-center justify-center">
                    <CircularProgress value={item.progress} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-200 border-gray-300 p-12">
              <h2 className="text-3xl font-semibold mb-8">Previous Interviews</h2>
              <div className="space-y-5">
                {interviewDetails.map((interview, index) => (
                  <div key={index} className="flex items-center p-8 bg-gray-300 rounded-lg">
                    <div className="h-14 w-14 rounded-full bg-gray-400 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="ml-8">
                      <p className="font-medium text-xl">{interview.title}</p>
                      <p className="text-lg text-gray-600">{interview.date}</p>
                      <p className="text-lg text-gray-600">{interview.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}