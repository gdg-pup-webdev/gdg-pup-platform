"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChangeEmailInitiate, useChangeEmailFinalize } from "../hooks"; 
import { LINKS } from "@/lib/constants/links";

export const EmailChangeFlow = () => {
  const router = useRouter();
  const { mutateAsync: initiateEmailChange, isPending: isInitiating, error: initError } = useChangeEmailInitiate();
  const { mutateAsync: finalizeEmailChange, isPending: isFinalizing, error: finalError } = useChangeEmailFinalize();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [otp, setOtp] = useState("");

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await initiateEmailChange({data:{ email, pass: password, newEmail }});
      if (res?.data?.referenceCode) {
        setReferenceCode(res.data.referenceCode);
        setStep(2);
      }
    } catch (err) {}
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await finalizeEmailChange({data:{ referenceCode, otp }});
      if (res?.data?.success) {
        router.push(LINKS.auth_signin || "/authentication/login");
      }
    } catch (err) {}
  };

  if (step === 1) {
    return (
      <form className="space-y-6" onSubmit={handleInitiate}>
        {initError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{initError.message}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Email Address</label>
          <div className="mt-1">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Email Address</label>
          <div className="mt-1">
            <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <button type="submit" disabled={isInitiating} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400">
          {isInitiating ? "Sending OTP..." : "Change Email"}
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleFinalize}>
      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">OTP sent to {newEmail}.</div>
      {finalError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{finalError.message}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">OTP</label>
        <div className="mt-1">
          <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      <button type="submit" disabled={isFinalizing} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400">
        {isFinalizing ? "Verifying..." : "Verify & Complete Change"}
      </button>
    </form>
  );
};
