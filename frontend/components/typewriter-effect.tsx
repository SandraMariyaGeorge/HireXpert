
"use client";
import React, { useEffect, useState } from "react";

export const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + (text[index] || ""));
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return <h1 className="text-4xl sm:text-6xl font-bold mb-6">{displayedText}</h1>;
};
