"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChangeEmailInitiate, useChangeEmailFinalize, useResendOtp } from "../hooks"; 
import { LINKS } from "@/lib/constants/links";

export const EmailChangeFlow = () => {
  const router = useRouter();
  const { mutateAsync: initiateEmailChange, isPending: isInitiating, error: initError } = useChangeEmailInitiate();
  const { mutateAsync: finalizeEmailChange, isPending: isFinalizing, error: finalError } = useChangeEmailFinalize();
  const { mutateAsync: resendOtp, isPending: isResending, error: resendError } = useResendOtp();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
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
      const res = await initiateEmailChange({ data: { email, password: password, newEmail } });
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
      const res = await finalizeEmailChange({ data: { referenceCode, otp } });
      if (res?.data?.success) {
        router.push(LINKS.profile_me);
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

  const inputStyles = "block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const labelStyles = "block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";
  const buttonStyles = "w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-6 w-full">
      {(initError || finalError || resendError) && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
          {initError?.message || finalError?.message || resendError?.message}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleInitiate} className="flex flex-col gap-5">
          <div>
            <label className={labelStyles}>Current Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} placeholder="current@email.com" />
          </div>

          <div>
            <label className={labelStyles}>Current Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} placeholder="••••••••" />
          </div>

          <div>
            <label className={labelStyles}>New Email</label>
            <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputStyles} placeholder="new@email.com" />
          </div>

          <button type="submit" disabled={isInitiating} className={buttonStyles}>
            {isInitiating ? "Sending OTP..." : "Initiate Email Change"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinalize} className="flex flex-col gap-5">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-700 dark:text-blue-300">
            OTP sent to <span className="font-semibold">{email}</span>. Please verify to change your email.
          </div>

          {resendSuccess && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-sm text-green-700 dark:text-green-300 text-center">
              A new OTP has been sent.
            </div>
          )}

          <div>
            <label className={labelStyles}>One-Time Password (OTP)</label>
            <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className={inputStyles} placeholder="000000" />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isResending}
              className="text-sm font-semibold text-blue-600 hover:text-blue-500 disabled:opacity-50 transition-colors"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </button>
          </div>

          <button type="submit" disabled={isFinalizing} className={buttonStyles}>
            {isFinalizing ? "Verifying..." : "Verify & Change Email"}
          </button>
        </form>
      )}
    </div>
  );
};
