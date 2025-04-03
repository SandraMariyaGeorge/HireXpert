'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Briefcase, FileText, MessageSquare, PlusCircle, Settings, BarChart2 } from 'lucide-react';
import Dashboard_Header from '@/components/dashboard_header';
import Dashboard_Sidebar from '@/components/dashboard_sidebar';

interface Interview {
  id: string;
  title: string;
  date: string;
  status: string;
  feedback?: string;
  score?: number;
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
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserDetails({
          name: userData.name || 'User',
          email: userData.email
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(message);
        console.error(message);
      }
    };

    const fetchInterviewResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/interviewresult/get', {
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

    fetchUserData();
    fetchInterviewResults();
  }, [router]);

 

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          {/* Modern spinner with gradient */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-black border-t-blue-100 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
          
          {/* Loading text with fade animation */}
          <p className="text-gray-600 font-medium animate-pulse">
            Loading your dashboard...
          </p>
          
          {/* Optional progress dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900">
      {/* Header */}
      <div className="flex-1 flex flex-col shadow-md bg-white">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 md:mb-10">
              Welcome back, <span className="text-blue-600">{userDetails.name}</span>!
            </h1>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
              <Card className="bg-white shadow-lg rounded-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <BarChart2 className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
                  <div className="ml-3 md:ml-4">
                    <p className="text-sm md:text-lg font-semibold text-gray-700">Total Interviews</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">{interviewCount}</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-white shadow-lg rounded-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
                  <div className="ml-3 md:ml-4">
                    <p className="text-sm md:text-lg font-semibold text-gray-700">Feedback Received</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {pastInterviews.filter(i => i.feedback).length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="bg-white shadow-lg rounded-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
                  <div className="ml-3 md:ml-4">
                    <p className="text-sm md:text-lg font-semibold text-gray-700">Avg. Score</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {pastInterviews.length > 0 
                        ? Math.round(pastInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / pastInterviews.length)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Past Interviews Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Past Interviews</h2>
              
              {isLoading ? (
                <p className="text-gray-500">Loading past interviews...</p>
              ) : pastInterviews.length === 0 ? (
                <p className="text-gray-500">No past interviews found</p>
              ) : (
                pastInterviews.map((interview) => (
                  <div key={interview.id} className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${interview.expanded ? 'p-8' : 'p-6'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{interview.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Completed on {new Date(interview.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-gray-800 rounded-full text-sm font-medium">
                        Score: {interview.score}/10
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Feedback:</h4>
                      {interview.expanded ? (
                        <p className="text-gray-600">{interview.feedback || 'No feedback available'}</p>
                      ) : (
                        <p className="text-gray-600">
                          {interview.feedback?.split('\n').slice(0, 2).join('\n') || 'No feedback available'}
                          {interview.feedback && interview.feedback.split('\n').length > 2 && (
                            <span
                              className="text-blue-500 cursor-pointer ml-2"
                              onClick={() =>
                                setPastInterviews((prev) =>
                                  prev.map((item) =>
                                    item.id === interview.id ? { ...item, expanded: true } : item
                                  )
                                )
                              }
                            >
                              Read more
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    {interview.expanded && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {interview.improvements && interview.improvements.length > 0 ? (
                            interview.improvements.map((item, index) => <li key={index}>{item}</li>)
                          ) : (
                            <li>No specific improvements mentioned</li>
                          )}
                        </ul>
                        <span
                          className="text-blue-500 cursor-pointer mt-4 block"
                          onClick={() =>
                            setPastInterviews((prev) =>
                              prev.map((item) =>
                                item.id === interview.id ? { ...item, expanded: false } : item
                              )
                            )
                          }
                        >
                          Show less
                        </span>
                      </div>
                    )}
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