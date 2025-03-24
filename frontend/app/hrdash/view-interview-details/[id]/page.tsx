"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import HrDash_Sidebar from '@/components/hrdashboard/Sidebar';

interface Candidate {
  id: string;
  user_id: string;
  score: number;
  feedback: string;
}

function InterviewResults() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Extract interview ID from URL path
  const pathParts = window.location.pathname.split('/');
  const interviewId = pathParts[pathParts.length - 1];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!interviewId) {
        setError('Interview ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/interviewresult/${interviewId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch candidates: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform the data to match our structure
        const formattedCandidates = data.map((result: any) => ({
          id: result._id || result.id,
          user_id: result.user_id,
          score: result.score,
          feedback: result.feedback
        }));

        // Sort candidates by score (highest first)
        formattedCandidates.sort((a: Candidate, b: Candidate) => b.score - a.score);
        setCandidates(formattedCandidates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [interviewId]);

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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
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
        <div className="flex-1 p-10 overflow-auto">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Candidates for Interview ID: {interviewId}
            </h1>
            
          </header>
          
          {candidates.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600 text-lg">No candidates found for this interview.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="p-4 bg-white rounded-md shadow-md">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Username: {candidate.user_id}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      candidate.score >= 8 ? 'bg-green-100 text-green-800' :
                      candidate.score >= 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Score: {candidate.score}/10
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-gray-700 font-medium">Feedback:</h3>
                    <p className="text-gray-600 mt-1">{candidate.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewResults;