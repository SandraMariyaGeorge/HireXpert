"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Briefcase, FileText, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/CircularProgress"; // Import the CircularProgress component
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/text-reveal-card"; // Import the TextRevealCard component

const handleRouting = (router: ReturnType<typeof useRouter>, path: string) => {
  router.push(path);
};

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-grey-100 dark:bg-grey-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-20`}>
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <Button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full" onClick={toggleSidebar}>
            <X className="text-white" /> {/* Set the icon color to white */}
          </Button>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-3 hover:bg-gray-700">
              <Button className="flex items-center space-x-2 w-full text-left" onClick={() => router.push('/mockquestions')}>
                <Briefcase className="w-5 h-5 text-white" /> {/* Set the icon color to white */}
                <span>Mock Interview</span>
              </Button>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Button className="flex items-center space-x-1 w-full text-left" onClick={() => router.push('/jobs')}>
                <Briefcase className="w-3 h-3 text-white" /> {/* Set the icon color to white */}
                <span>Job Listings</span>
              </Button>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Button className="flex items-center space-x-2 w-full text-left" onClick={() => router.push('/chatinterface')}>
                <FileText className="w-5 h-5 text-white" /> {/* Set the icon color to white */}
                <span>Resume Generation</span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between bg-black p-4 text-white">
          <div className="flex items-center space-x-4">
            <Button className="bg-black-500 hover:bg-black-400 p-2 rounded-full" onClick={toggleSidebar}>
              <Menu className="text-white" /> {/* Set the icon color to white */}
            </Button>
            <h1 className="text-2xl font-semibold text-white">Welcome to HireExpert</h1>
          </div>
          <div className="flex items-center space-x-4">
            <User className="w-6 h-6 text-white" /> {/* Set the icon color to white */}
            <span>Logged User</span>
            <Button className="bg-red-600 hover:bg-red-500 p-2 rounded-full" onClick={() => router.push('/')}>
              <LogOut className="text-white" /> {/* Set the icon color to white */}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-white text-black">
          <h2 className="text-3xl font-semibold">Welcome to the Dashboard</h2>
          <p className="mt-4 text-black-300">Here you can manage your activities and access various features.</p>
          
          {/* Cards with Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className="bg-gray-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Mock Interviews</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <img src="https://plus.unsplash.com/premium_photo-1661311898637-89c7fb8d1561?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am9iJTIwaW50ZXJ2aWV3fGVufDB8fDB8fHww" alt="Placeholder" className="w-full h-48 object-cover rounded-lg" />
                <p className="text-gray-300">Boost your confidence with AI-powered mock interviews. Get real-time feedback and ace your next job interview</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Resume Generation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <img src="https://plus.unsplash.com/premium_photo-1661328090120-a6ef40841abe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D" alt="Placeholder" className="w-full h-48 object-cover rounded-lg" />
                <p className="text-gray-300">Craft the perfect resume in minutes! Let AI highlight your skills and experience for the job you deserve.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Job Listings</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <img src="https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8am9iJTIwaW50ZXJ2aWV3fGVufDB8fDB8fHww" alt="Placeholder" className="w-full h-48 object-cover rounded-lg" />
                <p className="text-gray-300">Find your dream job with our AI-curated listings. The right opportunity is just a click away</p>
              </CardContent>
            </Card>
          </div>

          {/* Text Reveal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex justify-center">
              <TextRevealCard text="Hover to Reveal" revealText="Resume">
                <TextRevealCardTitle>Resume Generation</TextRevealCardTitle>
                <TextRevealCardDescription>Generate professional resumes effortlessly.</TextRevealCardDescription>
              </TextRevealCard>
            </div>
            <div className="flex justify-center">
              <TextRevealCard text="Hover to Reveal" revealText="Mock Interviews">
                <TextRevealCardTitle>Mock Interviews</TextRevealCardTitle>
                <TextRevealCardDescription>Practice and prepare for your interviews.</TextRevealCardDescription>
              </TextRevealCard>
            </div>
            <div className="flex justify-center">
              <TextRevealCard text="Hover to Reveal" revealText="Job Listings">
                <TextRevealCardTitle>Job Listings</TextRevealCardTitle>
                <TextRevealCardDescription>Find and apply for jobs that match your skills.</TextRevealCardDescription>
              </TextRevealCard>
            </div>
          </div>

          {/* Circular Progress Bars */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">User Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gray-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">Resume Generation</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <CircularProgress value={75} className="h-32 w-32 text-white" text={""} />
                  <p className="text-gray-300">75% Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">Mock Interviews</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <CircularProgress value={60} className="h-32 w-32 text-white" text={""} />
                  <p className="text-gray-300">60% Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">Job Listings</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <CircularProgress value={90} className="h-32 w-32 text-white" text={""} />
                  <p className="text-gray-300">90% Completed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}