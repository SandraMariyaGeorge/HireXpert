"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const handleRouting = (router: ReturnType<typeof useRouter>, path: string) => {
  router.push(path);
 };

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

type ChatInterfaceProps = {
  messages: any[]; // Adjust the type as needed
  setMessages: React.Dispatch<React.SetStateAction<any[]>>; // Adjust the type as needed
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages }) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const response = await fetch(`${BASE_URL}/chat/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          "user_input": input,
        })
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
    <div className="flex flex-col h-full w-full text-white relative">
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
          {/* This empty div is used as a reference for scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <PlaceholdersAndVanishInput
            placeholders={[
              "Hey there....",
              "I am here to collect your information",
              "Start chatting...",
            ]}
            // value={input} // Removed as the component does not support this prop
            onChange={handleInputChange}
            onSubmit={handleInputSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;