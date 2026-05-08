"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useChangeEmailInitiate, useChangeEmailFinalize } from "../hooks";
import { toast } from "react-toastify";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangeEmailDialog = ({ open, onOpenChange }: ChangeEmailDialogProps) => {
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
      const res = await initiateEmailChange({ data: { email, password: password, newEmail } });
      if (res?.data?.referenceCode) {
        setReferenceCode(res.data.referenceCode);
        setStep(2);
        toast.info("OTP sent to your new email.");
      }
    } catch (err) {
      toast.error("Failed to initiate email change.");
    }
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await finalizeEmailChange({ data: { referenceCode, otp } });
      if (res?.data?.success) {
        toast.success("Email changed successfully. Please log in again.");
        onOpenChange(false);
        // Usually we logout here or refresh
        window.location.reload();
      }
    } catch (err) {
      toast.error("Failed to verify OTP.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setNewEmail("");
    setReferenceCode("");
    setOtp("");
  };

  return (
    <Modal 
      open={open} 
      onOpenChange={(val) => {
        if (!val) resetForm();
        onOpenChange(val);
      }}
      className="max-w-md p-6 bg-white rounded-lg shadow-xl"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Change Email Address</h2>
        <p className="text-sm text-gray-500">
          {step === 1 
            ? "Enter your current credentials and the new email address." 
            : `Enter the OTP sent to ${newEmail}.`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleInitiate} className="space-y-4">
            {initError && <p className="text-sm text-red-500">{initError.message}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Email</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Current email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Your password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Email</label>
              <Input 
                type="email" 
                required 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                placeholder="New email"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isInitiating}>
                {isInitiating ? "Processing..." : "Continue"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFinalize} className="space-y-4">
            {finalError && <p className="text-sm text-red-500">{finalError.message}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code (OTP)</label>
              <Input 
                type="text" 
                required 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="Enter 6-digit code"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit" disabled={isFinalizing}>
                {isFinalizing ? "Verifying..." : "Confirm Change"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
