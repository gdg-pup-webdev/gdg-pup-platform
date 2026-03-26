"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupInitiate, useSignupFinalize } from "../hooks"; 
import { LINKS } from "@/lib/constants/links";
import { Stack, Input } from '@packages/spark-ui';
import Link from "next/link";

const ICON_URL = "https://www.figma.com/api/mcp/asset/7a525ea7-ee44-4ac7-97cc-7d9a5fc0cd62";

// 1. MOVE THIS OUTSIDE THE MAIN COMPONENT
const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] transition-all duration-300">
    {children}
  </div>
);

const inputBaseStyles = "!h-auto !py-[16px] !px-[16px] !border-none !rounded-[7px] !ring-0 focus-within:!ring-0 w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";

export const SignupFlow = () => {
  const router = useRouter();
  const { mutateAsync: initiateSignup, isPending: isInitiating, error: initError } = useSignupInitiate();
  const { mutateAsync: finalizeSignup, isPending: isFinalizing, error: finalError } = useSignupFinalize();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState("");
  const [otp, setOtp] = useState("");

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      const res = await initiateSignup({ data: { email, pass: password } });
      if (res?.data?.referenceCode) {
        setReferenceCode(res.data.referenceCode);
        setStep(2);
      }
    } catch (err) {}
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await finalizeSignup({ data: { referenceCode, otp } });
      if (res?.data?.success) {
        router.push(LINKS.auth_signin);
      }
    } catch (err) {}
  };

  return (
    <Stack gap="lg" className="w-full">
      {(initError || finalError || validationError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {validationError || initError?.message || finalError?.message}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleInitiate} className="flex flex-col gap-[24px]">
          {/* Email Field */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">Email Address</label>
            <StyledInputContainer>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
                placeholder="e.g., mail@mail.com"
              />
            </StyledInputContainer>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">Password</label>
            <StyledInputContainer>
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
                placeholder="Enter Your Password"
              />
            </StyledInputContainer>
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">Confirm Password</label>
            <StyledInputContainer>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
                placeholder="Re-enter Your Password"
              />
            </StyledInputContainer>
          </div>

          <button
            type="submit"
            disabled={isInitiating}
            className="w-full flex items-center justify-center bg-gradient-to-t from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)] text-white text-[18px] font-medium py-[12px] px-[16px] gap-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-70 transition-all"
          >
            {isInitiating ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinalize} className="flex flex-col gap-[24px]">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-200">
            OTP sent to <span className="font-bold text-white">{email}</span>. Please verify to continue.
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">One-Time Password (OTP)</label>
            <StyledInputContainer>
              <Input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
                placeholder="Enter 6-digit OTP"
              />
            </StyledInputContainer>
          </div>

          <button
            type="submit"
            disabled={isFinalizing}
            className="w-full flex items-center justify-center bg-gradient-to-t from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)] text-white text-[18px] font-medium py-[12px] px-[16px] gap-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-70 transition-all"
          >
            {isFinalizing ? "Verifying..." : "Verify & Complete Signup"}
          </button>
        </form>
      )}

      <div className="flex justify-center mt-6 items-center gap-[8px]">
        <span className="text-white/80 text-[16px] font-medium">Already have an account?</span>
        <Link href="/signin" className="text-white font-bold hover:underline">Sign In</Link>
      </div>
    </Stack>
  );
};