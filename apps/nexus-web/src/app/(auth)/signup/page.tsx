"use client";

import { SignUpForm } from "@/features/auth";
import { ShineBorder } from "@packages/spark-ui";

export default function SignUpPage() {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] backdrop-blur-[64px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative isolate w-full max-w-[500px] flex flex-col items-center gap-[48px] p-[32px] sm:px-[24px] rounded-[16px]">
      <ShineBorder shineColor={["#FB2C36", "#F0B100", "#00C950", "#2B7FFF"]} borderWidth={1.5} duration={40} className="opacity-80" />
      <div className="flex flex-col gap-[16px] text-center w-full z-10 relative">
        <h2 className="text-[32px] font-bold leading-[1.4] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#4285f4]" style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}>
          Welcome, Sparkmate!
        </h2>
        <p className="text-[#e5e5e5] text-[18px] leading-[1.5]" style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}>
          Sign up using your GDG ID to access your profile, XPark Points, and account settings.
        </p>
      </div>
      <div className="w-full z-10 relative">
        <SignUpForm />
      </div>
    </div>
  );
}
