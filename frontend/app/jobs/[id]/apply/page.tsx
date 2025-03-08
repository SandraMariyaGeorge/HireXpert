import { jobs } from '@/data/jobs';
import dynamic from 'next/dynamic';

// Import the client component dynamically with no SSR
const ApplyPageClient = dynamic(() => import('./apply-client'), { ssr: false });

// Generate static params for all job IDs
export function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id,
  }));
}

// This is a server component
export default function ApplyPage({ params }: { params: { id: string } }) {
  const job = jobs.find(j => j.id === params.id);
  
  // Pass the job data to the client component
  return (
    <div className="min-h-screen bg-background">
      <ApplyPageClient job={job} />
    </div>
  );
}