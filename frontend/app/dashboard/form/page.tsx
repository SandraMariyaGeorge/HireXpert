"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import router, { useRouter } from "next/navigation";
import DashboardLayout from "../../layout";
// import { SparklesEffect } from "@/components/sparkles"; // Import the sparkles effect

// Function to handle routing
const handleRouting = (router: ReturnType<typeof useRouter>, path: string) => {
  router.push(path);
};

export default function Form() {
  const router = useRouter();
  
  return (
    <DashboardLayout>
    <div className="relative min-h-screen bg-black">
      {/* <SparklesEffect /> Apply the sparkles effect */}
      <section id="form" className="py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-screen">
        <Card className="bg-white dark:bg-gray-700 shadow-xl w-full max-w-md z-10">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
              Choose the type of Interview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Button
              className="bg-purple-600 animate-pulse hover:animate-none hover:scale-105 transition-transform"
              onClick={() => router.push('/mockinterview')}
            >
              Mock Interview
            </Button>
            <Button
              className="bg-purple-600 animate-pulse hover:animate-none hover:scale-105 transition-transform"
              onClick={() => router.push('/mockinterview')}
            >
              Attend Test
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
    </DashboardLayout>
  );
}
