"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress = ({ value, className }: ProgressProps) => {
  return (
    <div className={cn("relative w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <div
        className="h-full bg-blue-500 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
