"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import HrDash_Sidebar from '@/components/hrdashboard/Sidebar';
import Header from '@/components/common/Header';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
function CreateInterview() {
  const [interviewTitle, setInterviewTitle] = useState('');
  const [interviewDescription, setInterviewDescription] = useState('');
  const [qualities, setQualities] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setCsvFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
  });

  const handleCreateInterview = async () => {
    if (!csvFile) {
      alert('Please upload a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('interview_title', interviewTitle);
    formData.append('desc', interviewDescription);
    formData.append('qualities', qualities);
    formData.append('job_type', jobType);
    formData.append('csv', csvFile);

    try {
      const response = await fetch(`${BASE_URL}/interview/create-interview/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create interview');
      }

      const data = await response.json();
      console.log('Interview created successfully:', data);
      alert('Interview created successfully!');
      
      setInterviewTitle('');
      setInterviewDescription('');
      setQualities('');
      setJobType('');
      setCsvFile(null);

    } catch (error) {
      console.error('Error creating interview:', error);
      alert('Error creating interview. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <HrDash_Sidebar sidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-10 ml-3 mr-3">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Interview</h1>
          </header>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Interview Title</label>
              <input
                type="text"
                value={interviewTitle}
                onChange={(e) => setInterviewTitle(e.target.value)}
                className="mt-1 w-full border-gray-800 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold">Interview Description</label>
              <textarea
                value={interviewDescription}
                onChange={(e) => setInterviewDescription(e.target.value)}
                className="mt-1 block w-full border-gray-800 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold">Qualities Needed</label>
              <textarea
                value={qualities}
                onChange={(e) => setQualities(e.target.value)}
                className="mt-1 block w-full border-gray-800 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4 border-gray-700">
              <label className="block text-gray-800 font-semibold">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-2"
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
              <label className="block text-gray-500 text-sm mb-2">(include only the emails that you need to send this interview code)</label>
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
        </div>
      </div>
    </div>
  );
}

export default CreateInterview;