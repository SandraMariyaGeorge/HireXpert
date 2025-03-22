"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";

export default function InterviewPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  useEffect(() => {
    if (permissionGranted) {
      startCamera();
    }
  }, [permissionGranted]);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setPermissionGranted(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setPermissionGranted(false);
      setError("Camera & microphone access denied. Interview can't be conducted.");
    }
  };

  const denyPermissions = () => {
    setPermissionGranted(false);
    setError("Interview can't be conducted unless the camera & audio are enabled.");
  };

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        setError("Unable to access camera.");
      });
  };

  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setVideoEnabled(!videoEnabled);
    }
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    router.push("/"); // Redirect to home or another page after ending the call
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Dashboard_Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {/*Header */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Dashboard_Header toggleSidebar={toggleSidebar}/>
      <section className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
        {permissionGranted === null ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Allow Camera & Microphone for Interview
            </h2>
            <div className="flex space-x-4">
              <Button className="bg-grey-600 hover:bg-grey-700 px-6 py-3 text-lg" onClick={requestPermissions}>
                Grant Permission
              </Button>
              <Button className="bg-grey-600 hover:bg-grey-700 px-6 py-3 text-lg" onClick={denyPermissions}>
                Deny Permission
              </Button>
            </div>
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
        ) : permissionGranted ? (
          <div className="flex w-full h-screen">
            {/* Candidate (User's Camera) on the Left */}
            <div className="flex-1 flex flex-col justify-center items-center relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-4 flex space-x-4">
                <Button onClick={toggleAudio} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
                  {audioEnabled ? <Mic className="text-white" /> : <MicOff className="text-red-500" />}
                </Button>
                <Button onClick={toggleVideo} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
                  {videoEnabled ? <Video className="text-white" /> : <VideoOff className="text-red-500" />}
                </Button>
                <Button onClick={endCall} className="bg-red-600 hover:bg-red-700 p-2 rounded-full">
                  <PhoneOff className="text-white" />
                </Button>
              </div>
            </div>

            {/* AI Interviewer on the Right */}
            <div className="flex-1 flex flex-col justify-center items-center bg-gray-800 p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="text-center"
              >
                <img
                  src="/assets/avatarinterview.jpg" // Replace with interviewer avatar
                  alt="AI Interviewer"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-semibold mt-4">AI Interviewer</h3>
                <p className="text-gray-300 mt-2">&quot;Tell me about yourself...&quot;</p>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-500">
              Interview cant be conducted unless the camera & audio are enabled.
            </h2>
          </div>
        )}
      </section>
    </div>
    </div>
  );
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

