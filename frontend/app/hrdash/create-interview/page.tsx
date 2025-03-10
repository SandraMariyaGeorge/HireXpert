"use client";

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

function CreateInterview() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [qualities, setQualities] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');

  const handleCreateInterview = () => {
    // Logic to create interview
    console.log('Creating interview with:', { jobTitle, jobDescription, qualities, salary, jobType });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
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
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Salary</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Job Type</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <button
            onClick={handleCreateInterview}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-75"
          >
            Create Interview
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CreateInterview;