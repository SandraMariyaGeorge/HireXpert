'use client';

import Dashboard_Header from '@/components/dashboard_header';
import Dashboard_Sidebar from '@/components/dashboard_sidebar';
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function InterviewDashboard() {
  const router = useRouter();
  const [interviewCode, setInterviewCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchInterviewResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/interviewresult/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch interview results');
        }

        const data = await response.json();
        setPastInterviews(data.results || []);
        setScheduledInterviews(data.scheduled || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewResults();
  }, []);

  const handleJoinInterview = async () => {
    if (!interviewCode.trim()) {
      setError('Please enter an interview code');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${BASE_URL}/interview/${interviewCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("No interview found with this code");
      }
      else{
        router.push(`/dashboard/mockinterview?interviewId=${encodeURIComponent(interviewCode)}`);
      }
  
      const data = await response.json();
      alert(`Successfully fetched interview details: ${JSON.stringify(data)}`);
      // In a real app, you would redirect to the interview page or handle the data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinScheduledInterview = (interviewId: string) => {
    router.push(`/dashboard/mockinterview?interviewId=${encodeURIComponent(interviewId)}`);
  };

  return (
    <div className="flex min-h-screen bg-black relative">
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
        <div className="container px-10 py-10 w-full mx-auto">
          {/* Interview Code Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Join an Interview</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
              <input
                  type="text"
                  value={interviewCode}
                  onChange={(e) => setInterviewCode(e.target.value)}
                  placeholder="Enter interview code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                  onClick={handleJoinInterview}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-black transition-colors disabled:bg-black"
              >
                  {isLoading ? 'Joining...' : 'Join Interview'}
              </button>
              </div>
              
              {error && (
              <p className="mt-2 text-sm text-gray-900">{error}</p>
              )}
          </div>

          {/* Scheduled Interviews Section */}
          <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-italic text-white">Your Scheduled Interviews</h2>
          {scheduledInterviews.length === 0 ? (
            <p className="text-gray-500">No scheduled interviews found</p>
          ) : (
            scheduledInterviews.map((interview) => (
              <div key={interview._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{interview.interview_title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{interview.desc}</p>
                  <p className="text-gray-500 text-sm mt-1">Qualities: {interview.qualities}</p>
                  <p className="text-gray-500 text-sm mt-1">Job Type: {interview.job_type}</p>
                </div>
                <button
                  onClick={() => handleJoinScheduledInterview(interview._id)}
                  className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-black transition-colors"
                >
                  Attend the interview
                </button>
              </div>
            ))
          )}
        </div>

          {/* Past Interviews Section */}
          <div className="space-y-6">
              <h2 className="text-2xl font-italic text-white">Your Past Interviews</h2>
              
              {isLoading ? (
            <p className="text-gray-500">Loading past interviews...</p>
          ) : pastInterviews.length === 0 ? (
            <p className="text-gray-500">No past interviews found</p>
          ) : (
            pastInterviews.map((interview) => (
              <div key={interview.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <h4 className="font-medium text-gray-700 mb-2">Feedback </h4>

                      </div>

                      </div>

                      <div className="mt-4">
                      <p className="text-gray-600">{interview.feedback}</p>
                      </div>

                      {/* <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {interview.improvements && interview.improvements.length > 0 ? (
                          interview.improvements.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                          <li>No specific improvements mentioned</li>
                        )}
                      </ul>
                      </div> */}
                  </div>
                  </div>
              ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
}