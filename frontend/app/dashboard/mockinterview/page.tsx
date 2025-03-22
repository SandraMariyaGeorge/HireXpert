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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (permissionGranted) {
      startCamera();
    }
  }, [permissionGranted]);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => setError("Unable to access camera."));
  };

  const toggleAudio = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setVideoEnabled(!videoEnabled);
    }
  };

  const endCall = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    router.push("/");
  };

  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioStream = new MediaStream(stream.getAudioTracks());
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
        <section className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
          {permissionGranted === null ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Allow Camera & Microphone for Interview</h2>
              <div className="flex space-x-4">
                <Button onClick={requestPermissions}>Grant Permission</Button>
                <Button onClick={denyPermissions}>Deny Permission</Button>
              </div>
              {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
          ) : permissionGranted ? (
            <div className="flex w-full h-screen">
              <div className="flex-1 flex flex-col justify-center items-center relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute bottom-4 flex space-x-4">
                  <Button onClick={toggleAudio}>{audioEnabled ? <Mic /> : <MicOff className="text-red-500" />}</Button>
                  <Button onClick={toggleVideo}>{videoEnabled ? <Video /> : <VideoOff className="text-red-500" />}</Button>
                  <Button onClick={endCall}><PhoneOff className="text-white" /></Button>
                  <Button onClick={startRecording} className={`bg-blue-600 hover:bg-blue-700 p-2 rounded-full ${isRecording ? 'hidden' : ''}`}>
                    Start Recording
                  </Button>
                  <Button onClick={stopRecording} className={`bg-blue-600 hover:bg-blue-700 p-2 rounded-full ${!isRecording ? 'hidden' : ''}`}>
                    Stop Recording
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full">
                    Send
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center bg-gray-800 p-6">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                  <img src="/assets/avatarinterview.jpg" alt="AI Interviewer" className="w-40 h-40 rounded-full border-4 border-white shadow-lg" />
                  <h3 className="text-xl font-semibold mt-4">AI Interviewer</h3>
                  <p className="text-gray-300 mt-2">Tell me about yourself</p>
                </motion.div>
              </div>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-red-500">Interview cant be conducted unless the camera & audio are enabled.</h2>
          )}
        </section>
      </div>
    </div>
  );
}
