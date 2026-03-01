import React from "react";
import { GdgLoader } from "@/components/ui/loader";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <GdgLoader />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};
