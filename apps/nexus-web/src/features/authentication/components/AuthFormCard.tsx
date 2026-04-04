import React from "react";
import { ShineBorder } from "@packages/spark-ui";

interface AuthFormCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/**
 * Shared card wrapper used by all auth pages (Sign In, Sign Up, Forgot Password).
 *
 * Responsive behaviour:
 * - Mobile (<sm): 20px horizontal padding, 28px vertical padding — prevents content
 *   from touching the screen edges on narrow viewports.
 * - sm+: Restores the original 32px all-round padding.
 */
export const AuthFormCard = ({ title, subtitle, children }: AuthFormCardProps) => {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] backdrop-blur-[64px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] relative isolate w-full max-w-[500px] flex flex-col items-center gap-[32px] sm:gap-[48px] px-5 py-7 sm:p-[32px] rounded-[16px]">
      <ShineBorder
        shineColor={["#FB2C36", "#F0B100", "#00C950", "#2B7FFF"]}
        borderWidth={1.5}
        duration={40}
        className="opacity-80"
      />

      {/* Card header */}
      <div className="flex flex-col gap-[12px] sm:gap-[16px] text-center w-full z-10 relative">
        <h2
          className="text-[26px] sm:text-[32px] font-bold leading-[1.4] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#4285f4]"
          style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
        >
          {title}
        </h2>
        <p
          className="text-[#e5e5e5] text-[15px] sm:text-[18px] leading-[1.5]"
          style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
        >
          {subtitle}
        </p>
      </div>

      {/* Form content */}
      <div className="w-full z-10 relative">{children}</div>
    </div>
  );
};
