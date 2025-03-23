"use client";

import React, { useState } from 'react';
import Layout from '@/components/common/Layout';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import HrDash_Sidebar from '@/components/hrdashboard/Sidebar';
import Link from 'next/link';

function TopCandidates() {
  interface Candidate {
    id: number;
    name: string;
    performanceSummary: string;
    interviewScore: number;
  }

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const router = useRouter();

  // Mock data for top candidates
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: 'John Doe',
      performanceSummary: 'John demonstrated excellent problem-solving skills and a deep understanding of software development principles.',
      interviewScore: 95,
    },
    {
      id: 2,
      name: 'Jane Smith',
      performanceSummary: 'Jane showed strong leadership qualities and a clear vision for product management.',
      interviewScore: 92,
    },
    {
      id: 3,
      name: 'Alice Johnson',
      performanceSummary: 'Alice exhibited exceptional analytical skills and a solid grasp of data science concepts.',
      interviewScore: 90,
    },
    {
      id: 4,
      name: 'Bob Brown',
      performanceSummary: 'Bob had a great understanding of backend systems and database management.',
      interviewScore: 88,
    },
    {
      id: 5,
      name: 'Charlie Davis',
      performanceSummary: 'Charlie demonstrated strong communication skills and a collaborative mindset.',
      interviewScore: 87,
    },
    {
      id: 6,
      name: 'Eve White',
      performanceSummary: 'Eve showed a keen eye for detail and a strong ability to debug complex issues.',
      interviewScore: 86,
    },
    {
      id: 7,
      name: 'Frank Wilson',
      performanceSummary: 'Frank exhibited a solid understanding of cloud computing and DevOps practices.',
      interviewScore: 85,
    },
    {
      id: 8,
      name: 'Grace Lee',
      performanceSummary: 'Grace demonstrated excellent project management skills and a proactive attitude.',
      interviewScore: 84,
    },
    {
      id: 9,
      name: 'Henry Harris',
      performanceSummary: 'Henry showed a strong ability to work under pressure and meet tight deadlines.',
      interviewScore: 83,
    },
    {
      id: 10,
      name: 'Ivy Clark',
      performanceSummary: 'Ivy exhibited a strong understanding of front-end development and user experience design.',
      interviewScore: 82,
    },
  ]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <HrDash_Sidebar sidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-10">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Top Candidates</h1>
          </header>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="p-4 bg-white rounded-md shadow-md">
                <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
                <p className="text-gray-700 mt-2">{candidate.performanceSummary}</p>
                <p className="text-gray-700 mt-2">
                  <strong>Interview Score:</strong> {candidate.interviewScore}
                </p>
                <Link href={`/hrdash/view-interview-details/id=${candidate.id}`}>
                  <button
                    className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-black transition duration-300"
                  >
                    View Details
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

export default TopCandidates;