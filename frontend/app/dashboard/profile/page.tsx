"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";
import Link from "next/link";
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    education: [] as any[],
    experience: [] as any[],
    projects: [] as any[],
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
        const response = await fetch(`${BASE_URL}/userdetails`, {
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
          name: data.name || "",
          email: data.contact_info?.email || "",
          phone: data.contact_info?.phone || "",
          linkedin: data.contact_info?.linkedin || "",
          github: data.contact_info?.github || "",
          education: data.education || [],
          experience: data.experience || [],
          projects: data.projects || [],
          technical_skills: data.technical_skills || {
            languages: "",
            frameworks: "",
            developer_tools: "",
          },
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const renderField = (label: string, value: string) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100">
          {value}
        </div>
      </div>
    );
  };

  const renderListSection = (title: string, items: React.ReactNode[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border-l-4 border-gray-300 pl-4">
              {item &&
                typeof item === "object" &&
                Object.entries(item).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className="mb-2">
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, " ")}:{" "}
                        </span>
                        <span>{value as string}</span>
                      </div>
                    )
                )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsSection = () => {
    if (!userDetails.technical_skills) return null;

    const { languages, frameworks, developer_tools } = userDetails.technical_skills;
    if (!languages && !frameworks && !developer_tools) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages && (
            <div>
              <h4 className="font-medium">Languages</h4>
              <div className="bg-gray-100 p-2 rounded">{languages}</div>
            </div>
          )}
          {frameworks && (
            <div>
              <h4 className="font-medium">Frameworks</h4>
              <div className="bg-gray-100 p-2 rounded">{frameworks}</div>
            </div>
          )}
          {developer_tools && (
            <div>
              <h4 className="font-medium">Developer Tools</h4>
              <div className="bg-gray-100 p-2 rounded">{developer_tools}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-black relative">
      <StarsBackground className="absolute inset-0 -z-10" />
      <ShootingStars className="absolute inset-0 -z-10" />
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-6 bg-gray-900">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>
            <div className="flex space-x-4">
              <div className="w-1/3 flex flex-col items-center">
                <img
                  src="/assets/avatar.png"
                  alt="User"
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold">{userDetails.name}</h2>
              </div>

              <div className="w-2/3 space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  {renderField("Name", userDetails.name)}
                  {renderField("Email", userDetails.email)}
                  {renderField("Phone", userDetails.phone)}
                  {renderField("LinkedIn", userDetails.linkedin)}
                  {renderField("GitHub", userDetails.github)}
                </div>

                {renderListSection("Education", userDetails.education)}

                {renderListSection("Work Experience", userDetails.experience)}

                {renderListSection("Projects", userDetails.projects)}

                {renderSkillsSection()}

                <div className="flex items-center justify-between pt-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}