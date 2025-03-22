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

  return (
    <ProtectedRoute role="candidate">
      <div className="min-h-screen bg-gray-100 text-gray-900">
        {loading && <LoadingOverlayComponent />}
        
        {/* Navbar */}
        <nav className="border-b border-gray-300 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button className="p-2 rounded-md hover:bg-gray-200" onClick={toggleSidebar}>
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 text-xl font-semibold">Candidate Dashboard</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-200 text-gray-900 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
                <button className="p-2 rounded-md hover:bg-gray-200 relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300" onClick={handleProfileClick}>
                  <User className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* Sidebar */}
          <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Welcome back, John!</h1>
              
              {/* Progress Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {progressItems.map((item) => (
                  <Card key={item.title} className="bg-gray-200 border-gray-300 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <item.icon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex items-center justify-center">
                      <CircularProgress value={item.progress} />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card className="bg-gray-200 border-gray-300 p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-300 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Applied to Senior Developer position</p>
                        <p className="text-sm text-gray-600">2 hours ago</p>
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