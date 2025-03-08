"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Briefcase, FileText, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/CircularProgress"; // Import the CircularProgress component

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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
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
              <Button className="flex items-center space-x-2 w-full text-left" onClick={() => router.push('/mockinterview')}>
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
              <Button className="flex items-center space-x-2 w-full text-left">
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
            <Button className="bg-red-600 hover:bg-red-500 p-2 rounded-full">
              <LogOut className="text-white" /> {/* Set the icon color to white */}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <h2 className="text-3xl font-semibold text-black">Welcome to the Dashboard</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Here you can manage your activities and access various features.</p>
          
          {/* Cards with Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className="bg-white dark:bg-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Card 1</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <img src="https://plus.unsplash.com/premium_photo-1661311898637-89c7fb8d1561?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am9iJTIwaW50ZXJ2aWV3fGVufDB8fDB8fHww" alt="Placeholder" className="w-full h-48 object-cover rounded-lg" />
                <p className="text-gray-600 dark:text-gray-300">Description for Card 1</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Card 2</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8am9iJTIwaW50ZXJ2aWV3fGVufDB8fDB8fHww" alt="Placeholder" className="w-full h-48 object-cover rounded-lg" />
                <p className="text-gray-600 dark:text-gray-300">Description for Card 2</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Card 3</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <img src="https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8am9iJTIwaW50ZXJ2aWV3fGVufDB8fDB8fHww" alt="Placeholder" className="w-full h-48 object-cover rounded-lg" />
                <p className="text-gray-600 dark:text-gray-300">Description for Card 3</p>
              </CardContent>
            </Card>
          </div>

          {/* Circular Progress Bars */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-black mb-4">User Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CircularProgress value={75} text="Resume Generation" className="h-32 w-32 mx-auto" />
              <CircularProgress value={60} text="Mock Interviews" className="h-32 w-32 mx-auto" />
              <CircularProgress value={90} text="Job Listings" className="h-32 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}