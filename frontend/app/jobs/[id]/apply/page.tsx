"use client";

import { useState, useEffect } from 'react';

import { Job } from '../../../../lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import ApplyPageClient from './apply-client';
import axios from 'axios';

export default function ApplyPage() {
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/job/${jobId}`);
        setJob(response.data);
      } catch (error) {
        setError('Failed to fetch job data');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    } else {
      setLoading(false);
      setError('Job ID not provided');
    }
  }, [jobId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <ApplyPageClient job={job} />;
}