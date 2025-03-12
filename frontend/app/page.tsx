"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, CheckCircle, Users, BarChart2, ArrowRight, LogInIcon, UserSearchIcon } from "lucide-react";
import { TypewriterEffect } from "@/components/typewriter-effect"; // Import the TypewriterEffect component

const Form = () => {
  return (
    <section id="form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          Contact Us
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <Input id="name" name="name" type="text" required className="mt-1 block w-full dark:bg-gray-700" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input id="email" name="email" type="email" required className="mt-1 block w-full dark:bg-gray-700" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea id="message" name="message" rows={4} required className="mt-1 block w-full dark:bg-gray-700"></textarea>
          </div>
          <Button type="submit" className="bg-black hover:bg-gray-700 w-full">
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
};

export default function Home() {
  const [active, setActive] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false); // State to control card visibility
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const router = useRouter();

  const handleButtonClick = () => {
    setShowCard(true); // Show the card when the button is pressed
  };

  const handleClose = () => {
    setShowCard(false); // Hide the card when the close button is pressed
  };

  const handleCandidateLogin = () => {
    router.push("/signin"); // Navigate to candidate login page
  };

  const handleHRLogin = () => {
    router.push("/hrsignup"); // Navigate to HR login page
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // const handleMockInterviewClick = () => {
  //   router.push("/form"); // Navigate to the form page
    
  // };
  // const handleDashboardClick = () => {
  //   router.push("/dashboard"); // Navigate to the form page
    
  // };

  return (
    <main className="min-h-screen relative">
      <div className="flex justify-between items-center p-4 bg-black">
        <UserSearchIcon className="h-8 w-8 text-white" /> {/* Increase the size of the icon */}
        <div className="flex space-x-4">
          <Button className="bg-white text-black hover:bg-black hover:text-white" onClick={() => scrollToSection("services")}>
            Services
          </Button>
          <Button className="bg-white text-black hover:bg-black hover:text-white" onClick={() => scrollToSection("features")}>
            Features
          </Button>
          {/* <Button className="bg-white text-black hover:bg-black hover:text-white" onClick={handleMockInterviewClick}>
            Mock Interview
          </Button> */}
          <Button className="bg-white text-black hover:bg-black hover:text-white" onClick={() => scrollToSection("pricing")}>
            Pricing
          </Button>
          {/* <Button className="bg-white text-black hover:bg-black hover:text-white" onClick={handleDashboardClick}>
          Dashboard
        </Button> */}
        </div>
        <Button className="bg-white text-black hover:bg-black hover:text-white" onClick={handleButtonClick}>
          Login <LogInIcon className="ml-2 h-4 w-4" />
        </Button>
        
      </div>
      
      {/* Show the card as a pop-up when the button is pressed */}
      {showCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-40">
          <Card className="p-6 relative w-full max-w-md">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-600 dark:text-gray-300">
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-2">Welcome Back!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please select your login type.
            </p>
            <div className="flex justify-between">
              <Button className="bg-black hover:bg-gray-700 w-1/2 mr-2" onClick={handleCandidateLogin}>
                Candidate Login
              </Button>
              <Button className="bg-black hover:bg-gray-700 w-1/2 ml-2" onClick={handleHRLogin}>
                HR Login
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Hero Section */}
      <section id="hero" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-black text-white dark:bg-gray-900 dark:text-gray-100">
            AI-Powered Interviews
          </Badge>
          <TypewriterEffect text="HiireExpert your interviewing spree in" /> Use the TypewriterEffect component
          <div className="flex justify-center items-center gap-2 mb-8">
            <span className="text-4xl sm:text-6xl font-bold text-black">50+ Languages</span>
          </div>

          {/* User Avatars */}
          <div className="flex justify-center mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Avatar key={i} className="border-2 border-white">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="ml-4 text-gray-600 dark:text-gray-300">
              10.2k+ AI interviews and counting-till date.
            </span>
          </div>

          {/* CTA Form */}
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input 
                type="tel" 
                placeholder="Enter your contact number"
                className="dark:bg-gray-800"
              />
              <Button className="bg-black hover:bg-gray-700">
                Try Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Zap className="h-12 w-12 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant feedback and detailed analysis of interview performance
              </p>
            </Card>
            <Card className="p-6">
              <Users className="h-12 w-12 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Languages</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for 50+ programming languages and frameworks
              </p>
            </Card>
            <Card className="p-6">
              <BarChart2 className="h-12 w-12 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive performance metrics and improvement suggestions
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Conditionally render the Form component */}
      {showForm && <Form />}

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your interview process?
          </h2>
          <p className="mb-8 text-gray-100">
            Join thousands of companies already using our platform
          </p>
          <Button size="lg" variant="secondary" onClick={handleButtonClick}>
            Get Started Now
          </Button>
        </div>
      </section>
    </main>
  );
}