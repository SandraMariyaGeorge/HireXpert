
"use client";

import ChatInterface from "@/components/ChatInterface";
import { FloatingDock } from "@/components/floating-dock";
import { ShootingStars } from "@/components/ShootingStars";
import { StarsBackground } from "@/components/stars-background";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bot, HomeIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");
  const [showChat, setShowChat] = useState(true);
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
     
        <StarsBackground />
        <ShootingStars />
        <ChatInterface messages={messages} setMessages={setMessages} />

        


    </div>
  );
}