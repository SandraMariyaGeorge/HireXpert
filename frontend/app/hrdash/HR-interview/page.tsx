"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function CreateInterview() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [qualities, setQualities] = useState('');
  const router = useRouter();

  const handleCreateInterview = () => {
    // Logic to create interview with AI or custom questions
    console.log('Creating interview with:', { jobTitle, jobDescription, qualities });
  };

  const handleCustomQuestions = () => {
    router.push('/HR-interview/custom-questions');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      
      <main className="flex-1 overflow-y-auto p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Interview</h1>
          </header>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Qualities Needed</label>
            <textarea
              value={qualities}
              onChange={(e) => setQualities(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleCreateInterview}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Create Interview
            </button>
            <button
              onClick={handleCustomQuestions}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Custom Questions
            </button>
          </div>
        </div>
      </main>
      
    </div>
  );
}

export default CreateInterview;