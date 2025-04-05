'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ApplyPageClient from '../../jobs/[id]/apply-client';
import type { Job } from '@/lib/types';
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const JobPage = ({ params }: { params: { id: string } }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decodedId = decodeURIComponent(params.id); 
    const numericId = decodedId.match(/\d+/)?.[0];
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/job/${numericId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative">
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
          <p className="text-gray-400 font-medium animate-pulse">
            Collecting more info about the job...
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative">
        <StarsBackground className="absolute inset-0 -z-10" />
        <ShootingStars className="absolute inset-0 -z-10" />
        <div className="text-white">{`Error: ${error}`}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <StarsBackground className="absolute inset-0 -z-10" />
      <ShootingStars className="absolute inset-0 -z-10" />
      {job ? <ApplyPageClient job={job} /> : null}
    </div>
  );
};

export default JobPage;
