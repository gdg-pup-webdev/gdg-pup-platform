import React from "react";
import { Spinner } from "@/components/ui";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};
