"use client";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressProps {
  value: number;
  text: string;
  className?: string;
}

export const CircularProgress = ({ value, text, className }: CircularProgressProps) => {
  return (
    <div className={className}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: "#4caf50",
          trailColor: "#d6d6d6",
        })}
      />
      <p className="text-center text-gray-600 dark:text-gray-300 mt-2">{text}</p>
    </div>
  );
};
 