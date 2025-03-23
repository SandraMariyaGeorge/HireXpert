"use client";

import React, { useState } from 'react';
import Layout from '@/components/common/Layout';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import HrDash_Sidebar from '@/components/hrdashboard/Sidebar';
import Link from 'next/link';

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          <HrDash_Sidebar sidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 p-10">
            <header className="mb-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">View Interview Details</h1>
            </header>
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="p-4 bg-white rounded-md shadow-md">
                  <h2 className="text-xl font-semibold text-gray-900">{interview.jobTitle}</h2>
                  <p className="text-gray-700">{interview.jobDescription}</p>
                  <p className="text-gray-700">Qualities: {interview.qualities}</p>
                  <p className="text-gray-700">Salary: {interview.salary}</p>
                  <p className="text-gray-700">Job Type: {interview.jobType}</p>
                  <Link href={`/hrdash/view-interview-details/id=${interview.id}`}>
                    <button
                      className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-black transition duration-300"
                    >
                      View Result
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

export default ViewInterviewDetails;