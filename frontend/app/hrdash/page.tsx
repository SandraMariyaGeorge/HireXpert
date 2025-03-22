"use client";
import React from 'react';
import HiringInsights from '@/components/hrdashboard/HiringInsights';
import ActivityFeed from '@/components/hrdashboard/ActivityFeed';
<<<<<<< HEAD
import Header from '@/components/common/Header'; // Common header component
import Footer from '@/components/common/Footer'; // Common footer component
//import ProtectedRoute from '@/components/ProtectedRoute';
=======
import Layout from '@/components/common/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
>>>>>>> 6fcb37c56b886c65c206e0137f82153be7d90ecf

function HRDashboard() {
  return (
<<<<<<< HEAD
   // <ProtectedRoute role="hr">
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
   // </ProtectedRoute>
=======
    //<ProtectedRoute role="hr">
      <Layout>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, HR Manager</p>
        </header>
        <HiringInsights />
        <ActivityFeed />
      </Layout>
    //</ProtectedRoute>
>>>>>>> 6fcb37c56b886c65c206e0137f82153be7d90ecf
  );
}

export default HRDashboard;