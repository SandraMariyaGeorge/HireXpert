"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import axios from 'axios';

function ViewInterviewDetails() {
  interface Interview {
    id: number;
    jobTitle: string;
    jobDescription: string;
    qualities: string;
    salary: string;
    jobType: string;
  }

  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/interviews');
        setInterviews(response.data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, []);

interface HandleViewResult {
    (interviewId: number): void;
}

const handleViewResult: HandleViewResult = (interviewId) => {
    // Logic to view interview result
    console.log('Viewing result for interview:', interviewId);
};

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <main className="flex-1 overflow-y-auto p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">View Interview Details</h1>
          </header>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold">{interview.jobTitle}</h2>
                <p className="text-gray-700">{interview.jobDescription}</p>
                <p className="text-gray-700">Qualities: {interview.qualities}</p>
                <p className="text-gray-700">Salary: {interview.salary}</p>
                <p className="text-gray-700">Job Type: {interview.jobType}</p>
                <button
                  onClick={() => handleViewResult(interview.id)}
                  className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-75"
                >
                  View Result
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ViewInterviewDetails;