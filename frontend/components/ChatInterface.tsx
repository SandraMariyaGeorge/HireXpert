"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
import axios from "axios";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user_input: input,
        }),
      });
      const responseData = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        text: responseData.bot_response,
        sender: "bot",
      };

      // Check if botMessage is "over" and navigate
      if (botMessage.text.toLowerCase() === "over") {
        router.push("/dashboard");
      }

      

      setMessages((prev) => [...prev, botMessage]);

      
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <PlaceholdersAndVanishInput
            placeholders={[
              "Type your name...",
              "Enter your text...",
              "Start chatting...",
            ]}
            onChange={handleInputChange}
            onSubmit={handleInputSubmit}
          />
        </div>
      </div>
    </div>
  );
}