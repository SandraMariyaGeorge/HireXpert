
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const usernameElement = form.elements.namedItem("username") as HTMLInputElement;
    const emailElement = form.elements.namedItem("email") as HTMLInputElement;
    const passwordElement = form.elements.namedItem("password") as HTMLInputElement;
    const aadhaarElement = form.elements.namedItem("aadhaar") as HTMLInputElement;

    if (!usernameElement || !emailElement || !passwordElement || !aadhaarElement) {
      setError("Please fill out the username, email, password, and Aadhaar fields");
      setIsLoading(false);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", usernameElement.value);
    formData.append("email", emailElement.value);
    formData.append("password", passwordElement.value);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "User created successfully") {
       
          router.push("/hrsignin");
        } else {
          setError("Signup failed");
        }
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-400 to-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px] grid md:grid-cols-2 gap-8 items-center">
        {/* Sign-up form */}
        <Card className="w-full max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl border-0">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-4xl font-bold tracking-tight font-poppins bg-gradient-to-r from-black-900 to-black-600 bg-clip-text text-transparent">
              Welcome to HireXpert!
            </CardTitle>
            <CardDescription className="text-black-300 text-base font-inter">
            Optimize Recruitment, Elevate Careers—Experience HireXpert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  className="h-12 w-full px-4 py-2 border border-black-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  className="h-12 w-full px-4 py-2 border border-black-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="h-12 w-full px-4 py-2 border border-black-300 rounded-md"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-base bg-black hover:bg-gray-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
            </form>
            {error && <div className="text-gray-500 text-center mt-4">{error}</div>}
            <div className="mt-8 text-center text-sm text-slate-500 font-inter">
              Already have an account?{" "}
              <Link href="/hrsignin" className="text-black-600 hover:text-black-300 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Side information */}
        <div className="hidden md:block bg-white p-8 rounded-2xl shadow-lg">
          <div className="relative h-[500px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Coal mining operations"
              fill
              className="object-cover rounded-xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 rounded-xl" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-2xl font-bold font-poppins mb-2">Streamline HR Processes</h2>
              <p className="text-slate-200 font-inter">
              Boost efficiency and engagement with smart digital solutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}