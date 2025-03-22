"use client";

import React, { useState } from 'react';
import Layout from '@/components/common/Layout';
import { useRouter } from 'next/navigation';

function ViewInterviewDetails() {
  interface Interview {
    id: number;
    jobTitle: string;
    jobDescription: string;
    jobQualifications: string;
    qualities: string;
    salary: string;
    jobType: string;
  }

  const router = useRouter();

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 1,
      jobTitle: 'Software Engineer',
      jobDescription: 'Develop and maintain web applications.',
      jobQualifications: 'Bachelor\'s degree in Computer Science or related field.',
      qualities: 'Strong problem-solving skills, teamwork, and communication.',
      salary: '$80,000 - $100,000',
      jobType: 'Full-Time',
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      jobDescription: 'Oversee product development from ideation to launch.',
      jobQualifications: 'Experience in product management and agile methodologies.',
      qualities: 'Leadership, strategic thinking, and customer focus.',
      salary: '$90,000 - $120,000',
      jobType: 'Full-Time',
    },
    {
      id: 3,
      jobTitle: 'Data Scientist',
      jobDescription: 'Analyze and interpret complex data to help make business decisions.',
      jobQualifications: 'Master\'s degree in Data Science or related field.',
      qualities: 'Analytical skills, statistical knowledge, and programming.',
      salary: '$100,000 - $130,000',
      jobType: 'Full-Time',
    },
  ]);

  const handleViewResult = (interviewId: number) => {
    // Redirect to the candidate summary page
    router.push(`/hrdash/candidate-summary/${interviewId}`);
  };

  const handleBack = () => {
    router.push('/hrdash');
  };

  return (
    <Layout>
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">View Interview Details</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
        >
          &larr; Back
        </button>
      </header>
      <div className="space-y-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">{interview.jobTitle}</h2>
            <p className="text-gray-700">{interview.jobDescription}</p>
            <p className="text-gray-700">Qualities: {interview.qualities}</p>
            <p className="text-gray-700">Salary: {interview.salary}</p>
            <p className="text-gray-700">Job Type: {interview.jobType}</p>
            <button
              onClick={() => handleViewResult(interview.id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              View Result
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default ViewInterviewDetails;