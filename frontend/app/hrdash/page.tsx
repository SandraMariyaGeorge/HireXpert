"use client";
import React from 'react';
import HiringInsights from '@/components/hrdashboard/HiringInsights';
import ActivityFeed from '@/components/hrdashboard/ActivityFeed';
import Layout from '@/components/common/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

function HRDashboard() {
  return (
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
  );
}

export default HRDashboard;