"use client";

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/navigation';

function CreateInterview() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [qualities, setQualities] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleCreateInterview = () => {
    // Logic to create interview
    console.log('Creating interview with:', { jobTitle, jobDescription, qualities, salary, jobType, csvFile });

    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        console.log('CSV file content:', text);
        // Process CSV file content here
      };
      reader.readAsText(csvFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };
 


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <main className="flex-1 overflow-y-auto p-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Interview</h1>
          </header>
       
          <div className="bg-white shadow-md rounded-lg p-6">
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
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Upload CSV File</label>
              <div className="flex items-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csvFileInput"
                />
                <label
                  htmlFor="csvFileInput"
                  className="px-4 py-2 bg-gray-400 text-gray-700 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition duration-300"
                >
                  Upload File
                </label>
                {csvFile && (
                  <span className="ml-4 text-gray-700">{csvFile?.name}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleCreateInterview}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-black hover:text-gray-700 transition duration-300"
            >
              Create Interview
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CreateInterview;