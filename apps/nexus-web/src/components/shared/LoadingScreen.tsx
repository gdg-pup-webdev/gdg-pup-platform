import React from "react";
import { GdgLoader } from "@/components/ui/loader";

interface LoadingScreenProps {
  message?: string;
  /** When true (default) fills the full viewport. When false, centers within parent container. */
  fullPage?: boolean;
  /** Toggle decorative full-screen background effects. Defaults to true only for fullPage loaders. */
  showBackground?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  fullPage = true,
  showBackground,
}) => {
  const shouldShowBackground = fullPage && (showBackground ?? true);

  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center gap-5 ${
        fullPage ? "min-h-screen bg-[#0F0E0E]" : "py-10"
      }`}
    >
      {shouldShowBackground && (
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(45% 35% at 50% 35%, rgba(66,133,244,0.24) 0%, rgba(66,133,244,0) 70%), radial-gradient(40% 30% at 28% 70%, rgba(234,67,53,0.2) 0%, rgba(234,67,53,0) 70%), radial-gradient(40% 30% at 72% 70%, rgba(52,168,83,0.2) 0%, rgba(52,168,83,0) 70%)",
          }}
        />
      )}
      <div className="relative">
        <GdgLoader />
      </div>
      <p className={`relative text-sm ${fullPage ? "text-white/75" : "text-white/70"}`}>{message}</p>
    </div>
  );
};
