import React, { useState, useEffect } from 'react';
import { ClipboardList, AlertCircle, Loader2 } from 'lucide-react'; // Changed icon
import ActivityFeed from './ActivityFeed'; // Assuming this is the correct path

// Reusable InsightCard component (assuming it's in a separate file or above)
const InsightCard = ({ icon: Icon, title, value, change }: {
  icon: React.ElementType; // More generic type for Lucide icons
  title: string;
  value: string | number; // Value can be a number
  change?: string; // Make change optional
}) => (
  <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-2 text-gray-900">{value}</p>
        {change && <p className="text-sm text-gray-700 mt-2">{change}</p>}
      </div>
      <Icon className="w-8 h-8 text-gray-900" />
    </div>
  </div>
);

const HiringInsights = () => {
  const [dashboardData, setDashboardData] = useState<{
    insights: { total_interviews: number; evaluated_interviews: number };
    recent_interviews: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/interview/dashboard-data/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Error loading dashboard data: {error}</span>
        </div>
      );
    }

    if (!dashboardData) {
      return <p className="text-sm text-gray-500">No data available.</p>;
    }

    const { insights, recent_interviews } = dashboardData;

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InsightCard
            icon={ClipboardList}
            title="Total Interviews Defined"
            value={insights.total_interviews}
            change="+20% from last month"
          />
          <InsightCard
            icon={AlertCircle}
            title="Evaluated Interviews"
            value={insights.evaluated_interviews}
            change="+10% from last month"
          />
          <InsightCard
            icon={ClipboardList}
            title="Total Interviews Scheduled"
            value={insights.total_interviews} // Assuming this is the same as total_interviews
            change="+5% from last month"
          />
        </div>
        <ActivityFeed recentInterviews={recent_interviews} />
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Hiring Insights</h2>
      {renderContent()}
    </div>
  );
};

export default HiringInsights;