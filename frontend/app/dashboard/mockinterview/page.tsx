"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
import Dashboard_Sidebar from "@/components/dashboard_sidebar";
import Dashboard_Header from "@/components/dashboard_header";
import { useSearchParams } from "next/navigation";
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function InterviewPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const searchParams = useSearchParams();
  const jobDescription = searchParams.get("jobDescription");
  const interviewId = searchParams.get("interviewId");
  const jobId = searchParams.get("jobId");

  useEffect(() => {
    if (jobDescription || interviewId || jobId) {
      const contextData = {
        jobDescription: jobDescription || null,
        interviewId: interviewId || null,
        jobId: jobId || null,
      };

      axios
        .post(`${BASE_URL}/interview/start-interview/`, contextData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        })
        .then((response) => {
          const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          setAudioUrl(audioUrl);
          audio.play();
          const interviewDataHeader = response.headers["x-interview-data"];
          if (interviewDataHeader) {
            const parsedData = JSON.parse(interviewDataHeader);
            setFollowUpQuestion(parsedData.question);
            
          }
        })
        .catch((error) => {
          console.error("Error sending context to backend:", error);
        });
    }
  }, [jobDescription, interviewId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const completeBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(completeBlob);
        audioChunks.current = []; // Clear chunks after recording
      };

      mediaRecorder.start();
      setRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("No audio recorded!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recorded-audio.wav");

      const uploadResponse = await axios.post(`${BASE_URL}/interview/process-audio/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      if (uploadResponse.headers['x-interview-data']) {
        const interviewData = JSON.parse(uploadResponse.headers['x-interview-data']);
        setFollowUpQuestion(interviewData.question);
      } else {
        console.warn("No follow-up question found in the response headers.");
      }

      const contentType = uploadResponse.headers["content-type"];
      if (contentType.includes("audio/mpeg")) {
        const audioBlob = new Blob([uploadResponse.data], { type: "audio/mpeg" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        new Audio(url).play();
      } else {
        alert("Unexpected response from the server.");
      }
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
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const audioTracks = stream.getAudioTracks();
          audioTracks.forEach((track) => (track.enabled = false));
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  }, []);
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
      <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Dashboard_Header toggleSidebar={toggleSidebar} />
        <section className="flex flex-col lg:flex-row justify-center items-center min-h-screen p-6">
          {/* Camera Feed */}
          <div className="flex-1 flex flex-col justify-center items-center relative border-r border-gray-700 p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 flex space-x-4">
              <Button
                onClick={toggleAudio}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-md"
              >
                {audioEnabled ? <Mic className="text-white" /> : <MicOff className="text-red-500" />}
              </Button>
              <Button
                onClick={toggleVideo}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-md"
              >
                {videoEnabled ? <Video className="text-white" /> : <VideoOff className="text-red-500" />}
              </Button>
              <Button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 p-3 rounded-full shadow-md"
              >
                <PhoneOff className="text-white" />
              </Button>
            </div>
          </div>

          {/* AI Interviewer */}
          <div className="flex-1 flex flex-col justify-center items-center bg-gray-800 p-8 rounded-lg shadow-lg">
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
              <h3 className="text-2xl font-semibold mt-4 text-white">AI Interviewer</h3>
            </motion.div>
            {followUpQuestion && (
                <div className="mt-6 p-2 bg-gray-700 text-white rounded-lg shadow-lg w-full max-w-2xl">
                  <h4 className="text-2xl font-bold text-center mb-4">Question</h4>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">
                    {followUpQuestion}
                  </p>
                </div>
              )}
            <div className="flex flex-col items-center">
              <div className="h-20 flex items-center">
                {recording && (
                  <div className="text-white text-lg font-medium animate-pulse">
                    Recording...
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={toggleRecording}
                  className={`${
                    recording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-6 py-3 rounded-lg shadow-md`}
                >
                  {recording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Button
                  onClick={uploadAudio}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md"
                  disabled={!audioBlob}
                >
                  Upload Audio
                </Button>
              </div>
              {audioBlob && (
                <div className="text-center mt-4">
                  <Button
                    onClick={() => new Audio(URL.createObjectURL(audioBlob)).play()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md"
                  >
                    Replay Recording
                  </Button>
                </div>
              )}
              {audioUrl && (
                <div className="text-center mt-4">
                  <Button
                    onClick={() => new Audio(audioUrl).play()}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md"
                  >
                    Play Question Again
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