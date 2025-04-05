"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, DollarSign, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Dashboard_Header from "@/components/dashboard_header";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  interface Job {
    id: string;
    metadata: {
      companyLogo?: string;
      company: string;
      title: string;
      location: string;
      salary: string;
      type: string;
      posted: string;
      description: string;
    };
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (query = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/job/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data); // Backend returns an array of job objects
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs(searchTerm);
  };

  const toggleDescription = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const getTruncatedDescription = (description: string, jobId: string) => {
    const sentences = description.split('. ');
    const truncated = sentences.slice(0, 4).join('. ') + (sentences.length > 4 ? '...' : '');
    return expandedJobId === jobId ? description : truncated;
  };

  return (
    <div className="flex min-h-screen bg-black relative">
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />

        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-4">
              <h1 className="text-4xl font-italic text-white">Find Your Next Opportunity</h1>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>

            {loading && <p className="text-center">Loading jobs...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="grid gap-6">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          {job.metadata.companyLogo && (
                            <img
                              src={job.metadata.companyLogo}
                              alt={job.metadata.company}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-xl font-semibold">{job.metadata.title}</h3>
                            <p className="text-muted-foreground">{job.metadata.company}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.metadata.location}
                              </Badge>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {job.metadata.salary}
                              </Badge>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {job.metadata.type}
                              </Badge>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {job.metadata.posted}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Link href={`/dashboard/jobs/id=${job.id}`}>
                          <Button>Quick Apply</Button>
                        </Link>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {getTruncatedDescription(job.metadata.description, job.id)}
                        </p>
                        <Button
                          variant="link"
                          className="text-black-500"
                          onClick={() => toggleDescription(job.id)}
                        >
                          {expandedJobId === job.id ? "Read Less" : "Read More"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                !loading && <p className="text-center">No jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}