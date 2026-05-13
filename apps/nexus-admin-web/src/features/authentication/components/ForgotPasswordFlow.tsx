"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordInitiate, useForgotPasswordFinalize, useResendOtp } from "../hooks";
import { LINKS } from "@/lib/constants/links";
import Link from "next/link";
import { Mail, Key, Eye, EyeOff, Check } from "lucide-react";
import { OtpInput } from "./OtpInput";

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
    strengthBarColor = "bg-yellow-500";
    strengthTextColor = "text-yellow-600 dark:text-yellow-500";
  } else if (passwordStrengthScore === 5) {
    strengthLabel = "Strong";
    strengthBarColor = "bg-green-500";
    strengthTextColor = "text-green-600 dark:text-green-500";
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
      const res = await finalizeForgot({ data: { referenceCode, otp, newPassword: newPassword } });
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
    <div className="flex flex-col gap-8 w-full">
      {(initError || finalError || validationError || resendError) && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-600 dark:text-red-400">
          {validationError || initError?.message || finalError?.message || resendError?.message}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleInitiate} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-zinc-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className="text-zinc-400" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {newPassword.length > 0 && (
              <div className="flex items-center gap-3 px-1 mt-1">
                <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strengthBarColor} transition-all duration-300`} style={{ width: `${(passwordStrengthScore / 5) * 100}%` }} />
                </div>
                <span className={`text-xs font-bold w-12 text-right ${strengthTextColor}`}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className="text-zinc-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <span className="text-red-500 text-xs font-medium px-1 mt-1">Passwords do not match.</span>
            )}

            {/* Password Validation List */}
            <div className="flex flex-col gap-1.5 mt-4 px-1">
              <ValidationItem isValid={isLengthValid} label="At least 8 characters" />
              <ValidationItem isValid={hasUppercase} label="At least one uppercase letter (A-Z)" />
              <ValidationItem isValid={hasLowercase} label="At least one lowercase letter (a-z)" />
              <ValidationItem isValid={hasNumber} label="At least one number (0-9)" />
              <ValidationItem isValid={hasSpecialChar} label="At least one special character (!@#$%^&*)" />
              <ValidationItem isValid={hasNoSpaces} label="No spaces" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isInitiating || !isPasswordValid || newPassword !== confirmPassword}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isInitiating ? "Sending OTP..." : "Send Reset OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinalize} className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Enter Verification Code</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Please enter the code we sent to your email
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{email || "your email"}</p>
          </div>

          {resendSuccess && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-xs text-green-600 dark:text-green-400 text-center">
              A new OTP has been sent to your email.
            </div>
          )}

          {/* 6-box OTP input */}
          <OtpInput value={otp} onChange={setOtp} />

          {/* Verify button */}
          <button
            type="submit"
            disabled={isFinalizing || otp.length < 6}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFinalizing ? "Verifying..." : "Verify"}
          </button>

          {/* Resend row */}
          <div className="flex justify-center items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {resendTimer > 0 ? (
              <span>Code expires in <span className="text-zinc-900 dark:text-zinc-100 font-medium">{resendTimer}s</span></span>
            ) : (
              <span>Didn't receive a code?</span>
            )}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isResending}
              className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-500 transition-colors disabled:opacity-40"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
        Remembered your password?{" "}
        <Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

const ValidationItem = ({ isValid, label }: { isValid: boolean; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isValid ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
      <Check size={12} strokeWidth={3} />
    </div>
    <span className={`text-xs ${isValid ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}>{label}</span>
  </div>
);
