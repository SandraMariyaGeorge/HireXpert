"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import HrDash_Sidebar from '@/components/hrdashboard/Sidebar';
import Link from 'next/link';

interface Interview {
  id: string;
  interview_title: string;  
  desc: string;
  qualities: string;
  salary: string;
  job_type: string;
}

function ViewInterviewDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/interview/get-interviews/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }

        const data = await response.json();
        // Ensure the data has proper IDs (convert _id to id if needed)
        const formattedInterviews = data.map((interview: any) => ({
          ...interview,
          id: interview._id ? interview._id : interview.id
        }));
        setInterviews(formattedInterviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <HrDash_Sidebar sidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 p-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <HrDash_Sidebar sidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 p-10">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <HrDash_Sidebar sidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-10">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">View Interview Details</h1>
          </header>
          {interviews.length === 0 ? (
            <p>No interviews found.</p>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="p-4 bg-white rounded-md shadow-md">
                  <h2 className="text-xl font-semibold text-gray-900">{interview.interview_title}</h2>
                  <p className="text-gray-700">{interview.desc}</p>
                  <p className="text-gray-700">Qualities: {interview.qualities}</p>
                  {interview.salary && <p className="text-gray-700">Salary: {interview.salary}</p>}
                  <p className="text-gray-700">Job Type: {interview.job_type}</p>
                  <Link href={`/hrdash/view-interview-details/${interview.id}`}>
                    <button
                      className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300"
                    >
                      View Result
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewInterviewDetails;