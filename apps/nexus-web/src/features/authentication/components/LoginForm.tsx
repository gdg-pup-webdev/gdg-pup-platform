"use client";

import React, { useState } from "react";
import { Stack, Input } from "@packages/spark-ui";
import { useAuthContext } from "../store/useAuthStore";
import Link from "next/link";
import { Mail, Key, Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
  const { status, login, error } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
    }
  };

  // deriving states 
  const isPending = status === "checking" || status === "loggingin";

  return (
    <Stack gap="lg" className="w-full">
      {error && (
        <div className="bg-red-50/10 border border-red-500/50 rounded-lg p-4 mb-4 text-[14px] text-red-200">
          {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        {/* Email Field */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="email" className="text-[18px] font-bold text-white">
            Email
          </label>
          <StyledInputContainer>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              containerClassName={inputBaseStyles}
              className="text-[18px] text-white placeholder:text-[#737373]"
              leftIcon={<Mail size={24} className="text-white shrink-0" />}
              placeholder="e.g., sparkylorenzo@gmail.com"
            />
          </StyledInputContainer>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="password"
            className="text-[18px] font-bold text-white"
          >
            Password
          </label>
          <StyledInputContainer>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              containerClassName={inputBaseStyles}
              className="text-[18px] text-white placeholder:text-[#737373]"
              leftIcon={<Key size={24} className="text-white shrink-0" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#a3a3a3] hover:text-white transition-colors shrink-0">
                  {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
              }
              placeholder="Enter Your Password"
            />
          </StyledInputContainer>
          <div className="flex justify-end mt-1">
            <a
              href="/forgot-password"
              className="text-white/80 text-[16px] font-medium hover:underline hover:text-white transition-colors"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center bg-gradient-to-t from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)] text-white text-[18px] font-medium py-[12px] px-[16px] gap-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-70 transition-all"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Footer / Redirect */}
      <div className="flex justify-center mt-6 items-center gap-[8px]">
        <span className="text-white/80 text-[16px] font-medium">
          Don't have an account yet?
        </span>
        <Link href="/signup" className="text-white font-bold hover:underline">
          Sign Up
        </Link>
      </div>
    </Stack>
  );
};

// Moved outside to prevent re-renders and input defocusing
const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] focus-within:p-[2px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_0_10px_rgba(251,44,54,0.35),0_0_20px_rgba(240,177,0,0.3),0_0_32px_rgba(43,127,255,0.4)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles =
  "!h-auto !py-[16px] !px-[16px] !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";
