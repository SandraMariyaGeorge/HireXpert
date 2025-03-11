"use client";
import React, { useState } from 'react';
import { Users, CalendarPlus, FileSpreadsheet } from 'lucide-react';
import Sidebar from '@/components/hrdashboard/Sidebar';
import HiringInsights from '@/components/hrdashboard/HiringInsights';
import ActivityFeed from '@/components/hrdashboard/ActivityFeed';
import Header from '@/components/common/Header'; // Common header component
import Footer from '@/components/common/Footer'; // Common footer component

function HRDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'create-interview', label: 'Create Interview', icon: CalendarPlus },
    { id: 'view-interview-details', label: 'View Interview Details', icon: FileSpreadsheet },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header /> {/* Common header */}
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} activeTab={activeTab} setActiveTab={setActiveTab} />
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
  );
}

export default HRDashboard;