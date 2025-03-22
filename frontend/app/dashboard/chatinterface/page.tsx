
"use client";

<<<<<<< HEAD
import ChatInterface from "@/components/ChatInterface";
=======
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import  ChatComponent from "@/components/ChatInterface";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bot, Image, Video, FileText, HomeIcon, SkipBackIcon, SkipForwardIcon, LogOutIcon } from "lucide-react";
>>>>>>> 6fcb37c56b886c65c206e0137f82153be7d90ecf
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
<<<<<<< HEAD

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
     
        <StarsBackground />
        <ShootingStars />
        <ChatInterface messages={messages} setMessages={setMessages} />

        


=======


  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 max-w-5xl">
      <div>
          <h2>Eagerly waiting to generate the resume.Move ahead to see something special</h2>
          </div>
        <Card className="p-6 bg-black/90 text-white relative">
          {activeTab === "chat" && (
            <>
              <StarsBackground /> 
              <ShootingStars /> 
            </>
          )}
          <Tabs defaultValue="chat" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-4 bg-black/40">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-white/10"
              >
                <Bot className="mr-2 h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="data-[state=active]:bg-white/10"
              >
                <Image className="mr-2 h-4 w-4" />
                Image
              </TabsTrigger>
              <TabsTrigger
                value="document"
                className="data-[state=active]:bg-white/10"
              >
                <FileText className="mr-2 h-4 w-4" />
                Document
              </TabsTrigger>
            </TabsList>
            <div className="mt-4" ref={chatContainerRef}>
              <TabsContent value="chat">
                {(showChat || activeTab === "chat") && <ChatComponent messages={messages} setMessages={setMessages} />}
              </TabsContent>
              <TabsContent value="image">
                <div className="h-[400px] flex items-center justify-center text-white/60">
                  Image generation coming soon
                </div>
              </TabsContent>
              <TabsContent value="video">
                <div className="h-[400px] flex items-center justify-center text-white/60">
                  Video generation coming soon
                </div>
              </TabsContent>
              <TabsContent value="document">
                <div className="h-[400px] flex items-center justify-center text-white/60">
                  {/* <FileUpload onSubmit={handleFileSubmit} /> */}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
        <FloatingDock 
          items={[
            { title: "Home", icon: <HomeIcon className="text-black" />, href: "/" }, 
            { title: "Back", icon: <SkipBackIcon className="text-black" />, href: "/signin" },
            { title: "Next", icon: <SkipForwardIcon className="text-black" />, href: "/dashboard" }
          ]}
        />
        <Button 
          className="bg-white hover:bg-white text-black p-2 rounded-lg mt-4" 
          onClick={() => router.push('/dashboard')}
        >
          End chat and go Dashboard
        </Button>
      </div>
>>>>>>> 6fcb37c56b886c65c206e0137f82153be7d90ecf
    </div>
  );
}