"use client";
import React from "react";
import { LoadingOverlay } from "@/components/ui/loading_overlay";

const LoadingOverlayComponent = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <LoadingOverlay />
    </div>
  );
};

export default LoadingOverlayComponent;
