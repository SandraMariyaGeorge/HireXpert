'use client';

import Dashboard_Header from '@/components/dashboard_header';
import Dashboard_Sidebar from '@/components/dashboard_sidebar';
import { useState } from 'react';

export default function InterviewDashboard() {
  const [interviewCode, setInterviewCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const pastInterviews = [
    {
      id: '1',
      title: 'Frontend Developer Interview',
      date: '2023-10-15',
      score: 8.5,
      feedback: 'Strong React skills but needs improvement in TypeScript',
      improvements: [
        'Practice advanced TypeScript patterns',
        'Work on system design concepts',
        'Improve time management during coding challenges'
      ]
    },
    {
      id: '2',
      title: 'Technical Screening',
      date: '2023-09-28',
      score: 7.0,
      feedback: 'Good problem-solving skills but could explain thought process better',
      improvements: [
        'Practice verbalizing your approach',
        'Study common algorithms',
        'Work on cleaner code organization'
      ]
    }
  ];

  const handleJoinInterview = () => {
    if (!interviewCode.trim()) {
      setError('Please enter an interview code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Joining interview with code: ${interviewCode}`);
      // In a real app, you would redirect to the interview page
    }, 1000);
  };

  return (

    <div className="flex min-h-screen bg-black">
          {/* Sidebar */}
          <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Dashboard_Header toggleSidebar={toggleSidebar} />
            <div className="container px-10 py-10">
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

            {/* Past Interviews Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-italic text-white">Your Past Interviews</h2>
                
                {pastInterviews.length === 0 ? (
                <p className="text-gray-500">No past interviews found</p>
                ) : (
                pastInterviews.map((interview) => (
                    <div key={interview.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
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
                        <p className="text-gray-600">{interview.feedback}</p>
                        </div>

                        <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {interview.improvements.map((item, index) => (
                            <li key={index}>{item}</li>
                            ))}
                        </ul>
                        </div>
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