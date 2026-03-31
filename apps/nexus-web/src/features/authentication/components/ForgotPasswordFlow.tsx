"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordInitiate, useForgotPasswordFinalize, useResendOtp } from "../hooks"; 
import { LINKS } from "@/lib/constants/links";
import { Stack, Input } from '@packages/spark-ui';
import Link from "next/link";

const ICON_URL = "https://www.figma.com/api/mcp/asset/7a525ea7-ee44-4ac7-97cc-7d9a5fc0cd62";

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] transition-all duration-300">
    {children}
  </div>
);

const inputBaseStyles = "!h-auto !py-[16px] !px-[16px] !border-none !rounded-[7px] !ring-0 focus-within:!ring-0 w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";

export const ForgotPasswordFlow = () => {
  const router = useRouter();
  const { mutateAsync: initiateForgot, isPending: isInitiating, error: initError } = useForgotPasswordInitiate();
  const { mutateAsync: finalizeForgot, isPending: isFinalizing, error: finalError } = useForgotPasswordFinalize();
  const { mutateAsync: resendOtp, isPending: isResending, error: resendError } = useResendOtp();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
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
    setValidationError(null);

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      const res = await initiateForgot({ data: { email } });
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
      const res = await finalizeForgot({ data: { referenceCode, otp, newPass: newPassword } });
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

  return (
    <Stack gap="lg" className="w-full">
      {(initError || finalError || validationError || resendError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {validationError || initError?.message || finalError?.message || resendError?.message}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleInitiate} className="flex flex-col gap-[24px]">
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

          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">New Password</label>
            <StyledInputContainer>
              <Input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
                placeholder="Enter New Password"
              />
            </StyledInputContainer>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">Confirm New Password</label>
            <StyledInputContainer>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<img src={ICON_URL} alt="" className="w-[24px] h-[24px]" />}
                placeholder="Re-enter New Password"
              />
            </StyledInputContainer>
          </div>

          <button
            type="submit"
            disabled={isInitiating}
            className="w-full flex items-center justify-center bg-gradient-to-t from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)] text-white text-[18px] font-medium py-[12px] px-[16px] gap-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-70 transition-all"
          >
            {isInitiating ? "Sending OTP..." : "Send Reset OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinalize} className="flex flex-col gap-[24px]">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-200">
            OTP sent to <span className="font-bold text-white">{email}</span>. Please verify to reset your password.
          </div>

          {resendSuccess && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-sm text-green-200">
              A new OTP has been sent to your email.
            </div>
          )}

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

          <div className="flex justify-between items-center px-1">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isResending}
              className="text-[14px] font-medium text-white hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isFinalizing}
            className="w-full flex items-center justify-center bg-gradient-to-t from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)] text-white text-[18px] font-medium py-[12px] px-[16px] gap-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-70 transition-all"
          >
            {isFinalizing ? "Verifying..." : "Verify & Reset Password"}
          </button>
        </form>
      )}

      <div className="flex justify-center mt-6 items-center gap-[8px]">
        <span className="text-white/80 text-[16px] font-medium">Remembered your password?</span>
        <Link href="/signin" className="text-white font-bold hover:underline">Sign In</Link>
      </div>
    </Stack>
  );
};