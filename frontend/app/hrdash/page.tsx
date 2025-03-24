"use client";
import React from 'react';
import HiringInsights from '@/components/hrdashboard/HiringInsights';
import ActivityFeed from '@/components/hrdashboard/ActivityFeed';
import Header from '@/components/common/Header'; // Common header component
import Footer from '@/components/common/Footer'; // Common footer component
import Sidebar from '@/components/hrdashboard/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import HrDash_Sidebar from '@/components/hrdashboard/Sidebar';

type SidebarItem = {
  id: string;
  label: string;
  icon: () => JSX.Element;
};

function HRDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [activeTab, setActiveTab] = React.useState('Dashboard'); // Example state for active tab

  return (
   //<ProtectedRoute role="hr">
      <div className="flex flex-col h-screen bg-gray-50">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <HrDash_Sidebar sidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome back, HR Manager</p>
              </header>
              <HiringInsights />
              <ActivityFeed />
            </div>
          </main>
        </div>
        <Footer /> {/* Common footer */}
      </div>
    //</ProtectedRoute>
  );
}

export default HRDashboard;