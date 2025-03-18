"use client"; // Add this directive since we're using client-side features

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, City, Country",
    jobTitle: "Software Engineer",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUserDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., update user details in the backend)
    console.log("Updated User Details:", userDetails);
};

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Dashboard_Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Dashboard_Header toggleSidebar={toggleSidebar}/>

        {/* Profile Update Form */}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
            <form onSubmit={handleUserDetailsSubmit}>
              <div className="flex space-x-4">
                {/* User Avatar and Name */}
                <div className="w-1/3 flex flex-col items-center">
                  <img
                    src="/assets/avatar.png"
                    alt="User"
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-semibold">{userDetails.name}</h2>
                </div>

                {/* User Details Form */}
                <div className="w-2/3">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={userDetails.name}
                      onChange={handleUserDetailsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={userDetails.email}
                      onChange={handleUserDetailsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={userDetails.phone}
                      onChange={handleUserDetailsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={userDetails.address}
                      onChange={handleUserDetailsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
                      Job Title
                    </label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      value={userDetails.jobTitle}
                      onChange={handleUserDetailsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {/* Add other fields as needed */}
                  <div className="flex items-center justify-between">
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}