'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Briefcase, FileText, MessageSquare, PlusCircle, Settings, BarChart2 } from 'lucide-react';
import Dashboard_Header from '@/components/dashboard_header';
import Dashboard_Sidebar from '@/components/dashboard_sidebar';
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Interview {
  id: string;
  title: string;
  date: string;
  status: string;
  feedback?: string;
  improvements?: string[];
  expanded?: boolean;
}

interface UserDetails {
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: ''
  });
  const [interviewCount, setInterviewCount] = useState(0);
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState('');

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
        setInterviewCount(data.results?.length || 0);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }

    fetchInterviewResults();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
          <p className="text-gray-400 font-medium animate-pulse">
            Loading your dashboard...
          </p>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <StarsBackground />
        <ShootingStars />
      </div>
      <div className="relative z-10 flex-1 flex flex-col shadow-md bg-gray-900">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
      </div>
      <div className="relative z-10 flex">
        <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-100 mb-6 md:mb-10">
              Welcome back, <span className="text-blue-400">{localStorage.getItem('name')}</span>!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
              <Card className="bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <BarChart2 className="h-8 w-8 md:h-10 md:w-10 text-blue-400" />
                  <div className="ml-3 md:ml-4">
                    <p className="text-sm md:text-lg font-semibold text-gray-300">Total Interviews</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-100">{interviewCount}</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-green-400" />
                  <div className="ml-3 md:ml-4">
                    <p className="text-sm md:text-lg font-semibold text-gray-300">Feedback Received</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-100">
                      {pastInterviews.filter(i => i.feedback).length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-100">Your Past Interviews</h2>

              {pastInterviews.length === 0 ? (
                <p className="text-gray-400">No past interviews found</p>
              ) : (
                pastInterviews.map((interview) => (
                  <div key={interview.id} className="bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300">
                    <div className="mb-2">
                      <h3 className="font-medium text-gray-300 mb-1">Feedback</h3>
                      <p className="text-gray-400 whitespace-pre-line">
                        {interview.expanded || !interview.feedback
                          ? interview.feedback || 'No feedback available'
                          : `${interview.feedback.split('\n').slice(0, 2).join('\n')}...`}
                      </p>
                      {interview.feedback && interview.feedback.split('\n').length > 2 && (
                        <button
                          className="mt-2 text-sm text-blue-400 hover:underline focus:outline-none"
                          onClick={() =>
                            setPastInterviews((prev) =>
                              prev.map((item) =>
                                item.id === interview.id ? { ...item, expanded: !item.expanded } : item
                              )
                            )
                          }
                        >
                          {interview.expanded ? 'Show less ▲' : 'Read more ▼'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
