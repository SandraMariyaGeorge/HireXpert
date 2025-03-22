"use client";

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/hrdashboard/Sidebar';
import Footer from '@/components/common/Footer';
import { CalendarPlus, Users, FileSpreadsheet } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface LayoutProps {
  children: React.ReactNode;
}

const CandidateDashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Users },
    { id: 'create-interview', label: 'Create Interview', icon: CalendarPlus },
    { id: 'view-interview-details', label: 'View Interview Details', icon: FileSpreadsheet },
  ];

  return (
    //<ProtectedRoute role="hr">
      <div className="flex flex-col h-screen bg-gray-50">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          {sidebarOpen && <Sidebar items={sidebarItems} activeTab={activeTab} setActiveTab={setActiveTab} />}
          <main className="flex-1 overflow-y-auto p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    //</ProtectedRoute>
  );
};

export default CandidateDashboardLayout;