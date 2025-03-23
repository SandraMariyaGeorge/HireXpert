"use client"; // Add this directive since we're using client-side features

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingOverlayComponent from "@/components/loading-overlay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard_Header from "@/components/dashboard_header";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import axios from "axios";

export default function ResumeGenerationPage() {
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [jobDesc, setJobDesc] = useState("");
    const router = useRouter();
    const { id } = useParams(); // Get the job ID from the URL

    useEffect(() => {
        if (!id) return; // If no ID is present, do nothing

        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/job/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setJobDesc(data); // Assuming the API returns a field named 'description'
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };

        fetchJobDetails();
    }, [id]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleResumeGenerationClick = async () => {
        if (!id) {
            alert("Job ID is not available");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
            const response = await axios.post(
                "http://127.0.0.1:8000/generate",
                { job_desc: jobDesc },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob", // Ensure the response is treated as a binary file
                }
            );

            // Create a URL for the PDF file and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "resume.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error generating resume:", error);
            alert("Failed to generate resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-black">
            {/* Sidebar */}
            <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            {/* Header */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <Dashboard_Header toggleSidebar={toggleSidebar} />
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
                    <Card className="bg-white p-16 rounded-lg shadow-lg max-w-3xl w-full text-center">
                        <CardHeader>
                            <CardTitle className="text-5xl font-buld text-black  mb-6">Resume Generation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={handleResumeGenerationClick}
                                disabled={loading}
                                className="w-full h-14 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg text-lg"
                            >
                                {loading ? "Generating..." : "Generate Resume"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Show loading overlay when loading is true */}
                    {loading && <LoadingOverlayComponent />}
                </div>
            </div>
        </div>
    );
}