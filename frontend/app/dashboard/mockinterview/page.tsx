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
import svg from "@/public/person.json"; // Assuming person.json is in assets folder
import Lottie from "lottie-react";
import AlertComp from "@/components/alertcomp";
import alertSvg from "@/public/feedback.json"; // Assuming alert.json is the Lottie animation for the alert

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function InterviewPage() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
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
  const [isUploading, setIsUploading] = useState(false); // Track upload button state
  const [isProcessing, setIsProcessing] = useState(false); // Track processing state for other actions
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState<string>(""); // State to store alert message

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
    if (isProcessing) return; // Prevent interaction during processing
    setIsProcessing(true);
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
    setTimeout(() => setIsProcessing(false), 1000); // Simulate processing delay
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("No audio recorded!");
      return;
    }

    setIsUploading(true); // Disable the button
    setFollowUpQuestion(null); // Clear the current question to show processing message
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

      if (uploadResponse.headers["x-interview-data"]) {
        const interviewData = JSON.parse(uploadResponse.headers["x-interview-data"]);
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
        const summary = uploadResponse.summary ? await uploadResponse.summary.text() : "Unknown error occurred.";
        setShowAlert(true);
        setAlertMessage(summary); // Set the alert message dynamically
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to process audio.");
    } finally {
      setIsUploading(false); // Re-enable the button
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
    <>
      {showAlert && (
        <AlertComp
          svg={alertSvg}
          message={alertMessage} // Use the dynamically set alert message
          buttonText="Close"
          onButtonClick={() => endCall()}
        />
      )}
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
        <Dashboard_Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col">
          <Dashboard_Header toggleSidebar={toggleSidebar} />
          <section className="flex flex-col lg:flex-row justify-center items-center min-h-screen p-6">
            {/* Camera Feed */}
            <div className="flex-1 flex flex-col justify-center items-center relative p-2">
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
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <div className="w-40 h-40 md:w-60 md:h-60">
                  <Lottie
                    animationData={svg}
                    {...defaultOptions}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <h3 className="text-3xl font-bold mt-6 text-white tracking-wide">AI Interviewer</h3>
              </motion.div>
              {followUpQuestion ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 p-4 bg-gray-700 text-white rounded-lg shadow-lg w-full max-w-2xl"
                >
                  <h4 className="text-xl font-semibold text-center mb-4 text-indigo-400">Question</h4>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">
                    {followUpQuestion}
                  </p>
                </motion.div>
              ) : isUploading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 p-4 bg-gray-700 text-white rounded-lg shadow-lg w-full max-w-2xl"
                >
                  <h4 className="text-xl font-semibold text-center mb-4 text-yellow-400">Processing...</h4>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">
                    The interviewer is listening... Please wait!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 p-4 bg-gray-700 text-white rounded-lg shadow-lg w-full max-w-2xl"
                >
                  <h4 className="text-xl font-semibold text-center mb-4 text-yellow-400">Processing...</h4>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">
                    The interviewer is thinking... Hold tight!
                  </p>
                </motion.div>
              )}
              <div className="flex flex-col items-center mt-6">
                {recording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="text-white text-lg font-medium animate-pulse"
                  >
                    Recording...
                  </motion.div>
                )}
                <div className="flex space-x-4 mt-4">
                  <Button
                    onClick={toggleRecording}
                    className={`px-6 py-3 rounded-lg shadow-md transition-transform transform ${recording
                      ? "bg-red-500 hover:bg-red-600 scale-105"
                      : "bg-blue-500 hover:bg-blue-600 scale-100"
                    }`}
                    disabled={isProcessing}
                  >
                    {recording ? "Stop Recording" : "Start Recording"}
                  </Button>
                  <Button
                    onClick={uploadAudio}
                    className={`px-6 py-3 rounded-lg shadow-md transition-transform transform bg-green-500 hover:bg-green-600 ${isUploading ? "opacity-50 cursor-not-allowed" : "scale-100"
                      }`}
                    disabled={!audioBlob || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Audio"}
                  </Button>
                </div>
                {audioUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mt-6"
                  >
                    <Button
                      onClick={() => new Audio(audioUrl).play()}
                      className="px-6 py-3 rounded-lg shadow-md bg-purple-500 hover:bg-purple-600 text-white transition-transform transform scale-100 hover:scale-105"
                    >
                      Play Question Again
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}