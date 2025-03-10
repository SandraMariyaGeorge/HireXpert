"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const handleRouting = (router: ReturnType<typeof useRouter>, path: string) => {
    router.push(path);
  };

export default function MockQuestions() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");

  const handleGenerateQuestions = () => {
    // Logic to generate questions based on job description
    console.log("Generating questions for:", jobDescription);
  };

  const handleAttendMockInterview = () => {
    // Logic to attend mock interview
    console.log("Attending mock interview for:", jobDescription);
    router.push('/mockinterview');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black">Enter Job Description</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-lg"
            placeholder="Copy and paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex space-x-4">
            <Button className="bg-blue-500 hover:bg-grey-600 text-white p-2 rounded-lg" onClick={handleGenerateQuestions}>
              Generate Questions
            </Button>
            <Button className="bg-red-500 hover:bg-grey-600 text-white p-2 rounded-lg" onClick={() => router.push('/mockinterview')}>
              Attend Mock Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}