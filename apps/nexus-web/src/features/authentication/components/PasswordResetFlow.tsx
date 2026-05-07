"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChangePasswordInitiate, useChangePasswordFinalize, useResendOtp } from "../hooks"; 
import { LINKS } from "@/lib/constants/links";
import { Stack, Input } from '@packages/spark-ui';

const gradientHoverUnderlineStyles = "relative inline-flex items-center after:absolute after:left-0 after:-bottom-[3px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-[#FB2C36] after:via-[#F0B100] after:to-[#2B7FFF] after:transition-transform after:duration-300 hover:after:scale-x-100";

const ICON_URL = "https://www.figma.com/api/mcp/asset/7a525ea7-ee44-4ac7-97cc-7d9a5fc0cd62";

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] focus-within:p-[2px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_0_10px_rgba(251,44,54,0.35),0_0_20px_rgba(240,177,0,0.3),0_0_32px_rgba(43,127,255,0.4)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles = "!h-auto !py-[16px] !px-[16px] !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";

export const PasswordResetFlow = () => {
  const router = useRouter();
  const { mutateAsync: initiateReset, isPending: isInitiating, error: initError } = useChangePasswordInitiate();
  const { mutateAsync: finalizeReset, isPending: isFinalizing, error: finalError } = useChangePasswordFinalize();
  const { mutateAsync: resendOtp, isPending: isResending, error: resendError } = useResendOtp();

  const [step, setStep] = useState<1 | 2>(2);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await initiateReset({ data: { email, password: password, newPassword: newPassword } });
      if (res?.data?.referenceCode) {
        setReferenceCode(res.data.referenceCode);
        setStep(2);
        setResendTimer(60);
      }
    } catch (err) {}
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await finalizeReset({ data: { referenceCode, otp } });
      if (res?.data?.success) {
        router.push(LINKS.auth_signin);
      }
    } catch (err) {}
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setResendSuccess(false);
    try {
      await resendOtp({ data: { referenceCode } });
      setResendTimer(60);
      setResendSuccess(true);
    } catch (err) {}
  };

  if (step === 1) {
    return (
      <form className="space-y-6" onSubmit={handleInitiate}>
        {initError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{initError.message}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="mt-1">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <div className="mt-1">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password (Min 8 chars)</label>
          <div className="mt-1">
            <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <button type="submit" disabled={isInitiating} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400">
          {isInitiating ? "Sending OTP..." : "Reset Password"}
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleFinalize}>
      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">OTP sent to {email}.</div>
      {resendSuccess && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">A new OTP has been sent to your email.</div>
      )}
      {finalError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{finalError.message}</div>}
      {resendError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{resendError.message}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">OTP</label>
        <div className="mt-1">
          <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      
      <div className="flex justify-between items-center px-1">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendTimer > 0 || isResending}
          className={`${gradientHoverUnderlineStyles} text-[14px] font-medium text-indigo-600 hover:text-indigo-500 transition-colors disabled:opacity-50 disabled:after:scale-x-0`}
        >
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </button>
      </div>

      <button type="submit" disabled={isFinalizing} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400">
        {isFinalizing ? "Verifying..." : "Verify & Change Password"}
      </button>
    </form>
  );
};