'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ApplyPageClient from '../../jobs/[id]/apply-client';
import type { Job } from '@/lib/types';

const JobPage = ({ params }: { params: { id: string } }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decodedId = decodeURIComponent(params.id); 
    const numericId = decodedId.match(/\d+/)?.[0];
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/job/${numericId}`, {
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return job ? <ApplyPageClient job={job} /> : <div>No job details available</div>;
};

export default JobPage;
