import React from "react";
import { GdgLoader } from "@/components/ui/loader";

interface LoadingScreenProps {
  message?: string;
  /** When true (default) fills the full viewport. When false, centers within parent container. */
  fullPage?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  fullPage = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullPage ? "min-h-screen" : "py-16"
      }`}
    >
      <GdgLoader />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
};
