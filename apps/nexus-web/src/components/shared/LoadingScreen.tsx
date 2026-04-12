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
      className={`relative overflow-hidden flex flex-col items-center justify-center gap-5 bg-[#0F0E0E] ${
        fullPage ? "min-h-screen" : "py-16"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 35%, rgba(66,133,244,0.24) 0%, rgba(66,133,244,0) 70%), radial-gradient(40% 30% at 28% 70%, rgba(234,67,53,0.2) 0%, rgba(234,67,53,0) 70%), radial-gradient(40% 30% at 72% 70%, rgba(52,168,83,0.2) 0%, rgba(52,168,83,0) 70%)",
        }}
      />
      <div className="relative rounded-2xl p-px" style={{ background: "linear-gradient(90deg, #EA4335, #F9AB00, #34A853, #4285F4)" }}>
        <div className="rounded-2xl bg-[#111213]/90 px-8 py-7 backdrop-blur-md">
          <GdgLoader />
        </div>
      </div>
      <p className="relative text-sm text-white/75">{message}</p>
    </div>
  );
};
