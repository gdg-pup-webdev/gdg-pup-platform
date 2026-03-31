"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordInitiate, useForgotPasswordFinalize, useResendOtp } from "../hooks";
import { LINKS } from "@/lib/constants/links";
import { Stack, Input } from '@packages/spark-ui';
import Link from "next/link";
import { Mail, Key, Eye, EyeOff, Check } from "lucide-react";
import { OtpInput } from "./OtpInput";

const gradientHoverUnderlineStyles = "relative inline-flex items-center after:absolute after:left-0 after:-bottom-[3px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-[#FB2C36] after:via-[#F0B100] after:to-[#2B7FFF] after:transition-transform after:duration-300 hover:after:scale-x-100";

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] focus-within:p-[2px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_0_10px_rgba(251,44,54,0.35),0_0_20px_rgba(240,177,0,0.3),0_0_32px_rgba(43,127,255,0.4)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles = "!h-auto !py-[16px] !px-[16px] !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";

export const ForgotPasswordFlow = () => {
  const router = useRouter();
  const { mutateAsync: initiateForgot, isPending: isInitiating, error: initError } = useForgotPasswordInitiate();
  const { mutateAsync: finalizeForgot, isPending: isFinalizing, error: finalError } = useForgotPasswordFinalize();
  const { mutateAsync: resendOtp, isPending: isResending, error: resendError } = useResendOtp();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Password Validations
  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
  const hasNoSpaces = newPassword.length > 0 && !/\s/.test(newPassword);

  const isPasswordValid = isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasNoSpaces;

  const passwordStrengthScore = [isLengthValid, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
  let strengthLabel = "Weak";
  let strengthBarColor = "bg-red-500";
  let strengthTextColor = "text-red-500";
  if (passwordStrengthScore >= 3 && passwordStrengthScore <= 4) {
    strengthLabel = "Fair";
    strengthBarColor = "bg-[#F0B100]";
    strengthTextColor = "text-[#F0B100]";
  } else if (passwordStrengthScore === 5) {
    strengthLabel = "Strong";
    strengthBarColor = "bg-[#00C950]";
    strengthTextColor = "text-[#00C950]";
  }

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

    if (!isPasswordValid) {
      setValidationError("Password does not meet all requirements.");
      return;
    }

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
    } catch (err) { }
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await finalizeForgot({ data: { referenceCode, otp, newPass: newPassword } });
      if (res?.data?.success) {
        router.push(LINKS.auth_signin);
      }
    } catch (err) { }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setResendSuccess(false);
    try {
      await resendOtp({ data: { referenceCode } });
      setResendTimer(60);
      setResendSuccess(true);
    } catch (err) { }
  };

  return (
    <Stack gap="lg" className="w-full">
      {(initError || finalError || validationError || resendError) && (
        <div className="bg-red-50/10 border border-red-500/50 rounded-lg p-4 text-[14px] text-red-200">
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
                leftIcon={<Mail size={24} className="text-white shrink-0" />}
                placeholder="e.g., mail@mail.com"
              />
            </StyledInputContainer>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">New Password</label>
            <StyledInputContainer>
              <Input
                type={showNewPassword ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<Key size={24} className="text-white shrink-0" />}
                rightIcon={
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-[#a3a3a3] hover:text-white transition-colors shrink-0">
                    {showNewPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                  </button>
                }
                placeholder="Enter New Password"
              />
            </StyledInputContainer>
            {newPassword.length > 0 && (
              <div className="flex items-center gap-[12px] px-1 mt-1">
                <div className="flex-1 h-[4px] bg-[#404040] rounded-full overflow-hidden">
                  <div className={`h-full ${strengthBarColor} transition-all duration-300`} style={{ width: `${(passwordStrengthScore / 5) * 100}%` }} />
                </div>
                <span className={`text-[14px] font-bold flex-shrink-0 w-[45px] text-right ${strengthTextColor}`}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[18px] font-bold text-white">Confirm New Password</label>
            <StyledInputContainer>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                containerClassName={inputBaseStyles}
                className="text-[18px] text-white placeholder:text-[#737373]"
                leftIcon={<Key size={24} className="text-white shrink-0" />}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#a3a3a3] hover:text-white transition-colors shrink-0">
                    {showConfirmPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                  </button>
                }
                placeholder="Re-enter New Password"
              />
            </StyledInputContainer>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <span className="text-[#FB2C36] text-[14px] font-medium px-1 mt-1">Passwords do not match.</span>
            )}

            {/* Password Validation List */}
            <div className="flex flex-col gap-[6px] mt-2 px-1">
              <div className="flex items-center gap-[8px]">
                {isLengthValid ? <Check size={16} className="text-white shrink-0" /> : <Check size={16} className="text-transparent shrink-0" />}
                <span className={`text-[14px] leading-none ${isLengthValid ? 'text-white' : 'text-[#a3a3a3]'}`}>At least 8 characters.</span>
              </div>
              <div className="flex items-center gap-[8px]">
                {hasUppercase ? <Check size={16} className="text-white shrink-0" /> : <Check size={16} className="text-transparent shrink-0" />}
                <span className={`text-[14px] leading-none ${hasUppercase ? 'text-white' : 'text-[#a3a3a3]'}`}>At least one uppercase letter (A-Z)</span>
              </div>
              <div className="flex items-center gap-[8px]">
                {hasLowercase ? <Check size={16} className="text-white shrink-0" /> : <Check size={16} className="text-transparent shrink-0" />}
                <span className={`text-[14px] leading-none ${hasLowercase ? 'text-white' : 'text-[#a3a3a3]'}`}>At least one lowercase letter (a-z)</span>
              </div>
              <div className="flex items-center gap-[8px] pl-[24px]">
                <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${hasNumber ? 'bg-[#a3a3a3]' : 'bg-[#404040]'}`} />
                <span className={`text-[14px] leading-none ${hasNumber ? 'text-[#a3a3a3]' : 'text-[#525252]'}`}>At least one number (0-9)</span>
              </div>
              <div className="flex items-center gap-[8px] pl-[24px]">
                <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${hasSpecialChar ? 'bg-[#a3a3a3]' : 'bg-[#404040]'}`} />
                <span className={`text-[14px] leading-none ${hasSpecialChar ? 'text-[#a3a3a3]' : 'text-[#525252]'}`}>At least one special character (!@#$%^&*)</span>
              </div>
              <div className="flex items-center gap-[8px] pl-[24px]">
                <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${hasNoSpaces ? 'bg-[#a3a3a3]' : 'bg-[#404040]'}`} />
                <span className={`text-[14px] leading-none ${hasNoSpaces ? 'text-[#a3a3a3]' : 'text-[#525252]'}`}>No Spaces in between.</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isInitiating || !isPasswordValid || newPassword !== confirmPassword}
            className="w-full flex items-center justify-center bg-gradient-to-t from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)] text-white text-[18px] font-medium py-[12px] px-[16px] gap-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-70 transition-all"
          >
            {isInitiating ? "Sending OTP..." : "Send Reset OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinalize} className="flex flex-col gap-[28px]">
          {/* Header */}
          <div className="flex flex-col gap-[8px] text-center">
            <h2 className="text-[24px] font-bold text-white">Enter Verification Code</h2>
            <p className="text-[14px] text-[#a3a3a3]">
              Please enter the code we sent to your email
            </p>
            <p className="text-[14px] font-semibold text-white">{email || "your email"}</p>
          </div>

          {resendSuccess && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 text-[13px] text-green-200 text-center">
              A new OTP has been sent to your email.
            </div>
          )}

          {/* 6-box OTP input */}
          <OtpInput value={otp} onChange={setOtp} />

          {/* Verify button */}
          <button
            type="submit"
            disabled={isFinalizing || otp.length < 6}
            className="w-full flex items-center justify-center bg-gradient-to-r from-[#2b7fff] to-[#1a4fd8] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.25)] text-white text-[18px] font-semibold py-[14px] px-[16px] rounded-[8px] hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {isFinalizing ? "Verifying..." : "Verify"}
          </button>

          {/* Resend row */}
          <div className="flex justify-center items-center gap-[6px] text-[14px] text-[#a3a3a3]">
            {resendTimer > 0 ? (
              <span>Code expires in <span className="text-white font-medium">{resendTimer}s</span></span>
            ) : (
              <span>Didn't receive a code?</span>
            )}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isResending}
              className={`${gradientHoverUnderlineStyles} text-white font-bold transition-colors disabled:opacity-40 disabled:after:scale-x-0`}
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </div>
        </form>
      )}

      <div className="flex justify-center mt-6 items-center gap-[8px]">
        <span className="text-white/80 text-[16px] font-medium">Remembered your password?</span>
        <Link href="/signin" className={`${gradientHoverUnderlineStyles} text-white font-bold`}>Sign In</Link>
      </div>
    </Stack>
  );
};