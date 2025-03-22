"use client";

import React, { useState, useCallback } from 'react';
import Layout from '@/components/common/Layout';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

function CreateInterview() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [qualities, setQualities] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setCsvFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
  });

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

  return (
    <Layout>
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
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-gray-700">Drop the file here...</p>
            ) : (
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m-5 4h.01M12 12v.01M12 16v.01M12 8v.01M16 12v.01M8 12v.01M16 16v.01M8 16v.01"
                  ></path>
                </svg>
                <p className="mt-2 text-gray-700">
                  {csvFile ? csvFile.name : 'Drag and drop a CSV file here, or click to select a file'}
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleCreateInterview}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300"
        >
          Create Interview
        </button>
      </div>
    </Layout>
  );
}

export default CreateInterview;