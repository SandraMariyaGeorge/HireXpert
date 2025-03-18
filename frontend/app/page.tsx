"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, CheckCircle, Users, BarChart2, ArrowRight, LogInIcon, UserSearchIcon, BarChart3, LucideSection } from "lucide-react";
import { TypewriterEffect, TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"; // Import the TypewriterEffect component

import { Form } from "react-hook-form";


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
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-black/30 backdrop-blur-lg border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-white" />
              <span className="ml-2 text-xl font-semibold">HireExpert</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-black" onClick={() => scrollToSection("services")}>
                Services
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-black" onClick={() => scrollToSection("services")}>
                Pricing
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-black" onClick={() => scrollToSection("services")}>
                Contact
              </Button>
              <Button variant="default" className="bg-white text-black hover:bg-gray-300" onClick={handleButtonClick}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <section>
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto ">
          <span className="px-4 py-1.5 mb-6 text-sm font-semibold bg-white text-black rounded-full inline-block">
            AI-Powered Interviews
          </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <TypewriterEffectSmooth words={[
              { text: "HireExpert" },
              { text: ": Supercharge" },
              { text: "Your Hiring Process" },
            ]} />
            </h1>
          <p className="text-gray-400 text-lg mb-8">
            Conduct AI-driven interviews in 50+ languages and make hiring faster & smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="text" 
              placeholder="Enter your contact number" 
              className="w-full bg-gray-800 text-white border border-gray-600 px-4 py-3 rounded-lg"
            />
            <Button className="bg-white text-black hover:bg-white-500 px-6 py-3 rounded-lg">
              Try Now
            </Button>
          </div>
        </div>
      </div>
      </section>


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
    

      {/* Features Section */}
      <section>
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-blue order border-gray-800 hover:border-blue-500/50 transition-colors">
            <Zap className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl text-white font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Get instant AI-powered interview assessments.</p>
          </Card>

          <Card className="p-6 bg-blue border-gray-800 hover:border-blue-500/50 transition-colors">
            <Users className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl text-white font-semibold mb-2">50+ Languages</h3>
            <p className="text-gray-400">Support for over 50 programming languages & frameworks.</p>
          </Card>

          <Card className="p-6 bg-blue border-gray-800 hover:border-blue-500/50 transition-colors">
            <BarChart3 className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl text-white font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-gray-400">Track your hiring process with real-time analytics.</p>
          </Card>
        </div>
      </div>
      </section>
    

    
    

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center text-black">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your interview process?
          </h2>
          <p className="mb-8 text-black-100">
            Join thousands of companies already using our platform
          </p>
          <Button className="bg-white text-black hover:bg-white"  onClick={handleButtonClick}>
            Get Started Now
          </Button>
        </div>
      </section>
      </main>
  );
}



