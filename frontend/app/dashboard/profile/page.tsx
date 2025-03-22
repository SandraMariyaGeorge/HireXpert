"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";
import Link from "next/link";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    education: [],
    experience: [],
    projects: [],
    technical_skills: {
      languages: "",
      frameworks: "",
      developer_tools: "",
    },
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/userdetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserDetails({
          name: data.name,
          email: data.contact_info.email,
          phone: data.contact_info.phone,
          linkedin: data.contact_info.linkedin,
          github: data.contact_info.github,
          education: data.education,
          experience: data.experience,
          projects: data.projects,
          technical_skills: data.technical_skills,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUserDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated User Details:", userDetails);
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="text"
                      value={userDetails.linkedin}
                      onChange={handleUserDetailsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="github">
                      GitHub
                    </label>
                    <input
                      id="github"
                      name="github"
                      type="text"
                      value={userDetails.github}
                      onChange={handleUserDetailsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href="/dashboard/chatinterface">
                      <Button className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base md:text-lg w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <span>Update Professional Details</span>
                        <span className="hidden sm:inline">/</span>
                        <span>Go to Chat Interface</span>
                      </Button>
                    </Link>
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