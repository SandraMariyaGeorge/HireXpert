"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";

// Dynamically import ReactMic with SSR disabled
const ReactMic = dynamic(() => import("react-mic").then((mod) => mod.ReactMic), { ssr: false });

export default function InterviewPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const startRecording = () => setRecording(true);
  const stopRecording = () => setRecording(false);

  const onStop = (recordedBlob: any) => {
    setBlob(recordedBlob.blob);
  };

  const uploadAudio = async () => {
    if (!blob) {
      alert("No audio recorded!");
      return;
    }

    const formData = new FormData();
    formData.append("file", blob, "recorded-audio.wav");

    try {
      const response = await axios.post("http://127.0.0.1:8000/interview/process-audio/", formData, {
        headers: { 
          "Content-Type": "multipart/form-data", 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        responseType: "blob"
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Automatically play the audio once received
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to process audio.");
    }
  };

  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setAudioEnabled((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setVideoEnabled((prev) => !prev);
    }
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    // Redirect to home or another page after ending the call
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Mute the local audio playback to prevent self-echo
          const audioTracks = stream.getAudioTracks();
          audioTracks.forEach((track) => (track.enabled = false));
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Dashboard_Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Dashboard_Header />
        <section className="flex flex-col lg:flex-row justify-center items-center min-h-screen bg-gray-900 text-white p-6">
          {/* Camera Feed */}
          <div className="flex-1 flex flex-col justify-center items-center relative border-r border-gray-700">
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

          {/* AI Interviewer */}
          <div className="flex-1 flex flex-col justify-center items-center bg-gray-800 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <img
                src="/assets/avatarinterview.jpg"
                alt="AI Interviewer"
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
              />
              <h3 className="text-xl font-semibold mt-4">AI Interviewer</h3>
              <p className="text-gray-300 mt-2">&quot;Tell me about yourself...&quot;</p>
            </motion.div>
            <div className="flex flex-col items-center space-y-4">
              <ReactMic
                record={recording}
                onStop={onStop}
                mimeType="audio/wav"
                strokeColor="#FFFFFF"
                backgroundColor="#1F2937"
                className="rounded-lg shadow-md"
              />
              <div className="flex space-x-4 mt-4">
                <Button
                  onClick={startRecording}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Start Recording
                </Button>
                <Button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Stop Recording
                </Button>
                <Button
                  onClick={uploadAudio}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Upload Audio
                </Button>
              </div>
              {audioUrl && (
                <div className="text-center mt-4">
                  <Button
                    onClick={() => {
                      const audio = new Audio(audioUrl!);
                      audio.play();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Replay Audio
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}



