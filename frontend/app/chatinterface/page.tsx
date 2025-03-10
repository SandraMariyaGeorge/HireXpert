"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
//import ShootingStars from "./ShootingStars";
import ShootingStars from "@/components/ShootingStars"

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot" | "error";
}

const sendMessage = async (message: string) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bot response");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return "Error fetching response. Please try again.";
  }
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botResponse = await sendMessage(input);

    const botMessage: Message = {
      id: Date.now() + 1,
      text: botResponse,
      sender: "bot",
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-col h-screen relative">
      <ShootingStars />
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : message.sender === "bot"
                    ? "bg-white/10 text-white"
                    : "bg-red-600 text-white"
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
            placeholders={["Type your name...", "Enter your text...", "Start chatting..."]}
            onChange={handleInputChange}
            onSubmit={handleInputSubmit}
          />
        </div>
      </div>
    </div>
  );
}
