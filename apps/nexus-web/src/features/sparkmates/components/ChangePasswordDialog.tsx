"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input"; 
import { toast } from "@/lib/nexus-toast";
import { useChangePasswordFinalize } from "../hooks/useChangePasswordFinalize";
import { useChangePasswordInitiate } from "../hooks/useChangePasswordInitiate";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({ open, onOpenChange }: ChangePasswordDialogProps) => {
  const { mutateAsync: initiatePasswordChange, isPending: isInitiating, error: initError } = useChangePasswordInitiate();
  const { mutateAsync: finalizePasswordChange, isPending: isFinalizing, error: finalError } = useChangePasswordFinalize();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [otp, setOtp] = useState("");

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      const res = await initiatePasswordChange({ data: { email, password: currentPassword, newPassword: newPassword } });
      if (res?.data?.referenceCode) {
        setReferenceCode(res.data.referenceCode);
        setStep(2);
        toast.info("Verification code sent to your email.");
      }
    } catch (err) {
      toast.error("Failed to initiate password change.");
    }
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await finalizePasswordChange({ data: { referenceCode, otp } });
      if (res?.data?.success) {
        toast.success("Password changed successfully. Please log in again.");
        onOpenChange(false);
        window.location.reload();
      }
    } catch (err) {
      toast.error("Failed to verify code.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
        <h2 className="text-xl font-bold">Change Password</h2>
        <p className="text-sm text-gray-500">
          {step === 1 
            ? "Enter your current credentials and the new password." 
            : `Enter the verification code sent to your email.`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleInitiate} className="space-y-4">
            {initError && <p className="text-sm text-red-500">{initError.message}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input 
                type="password" 
                required 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                placeholder="Current password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input 
                type="password" 
                required 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="New password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm new password"
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
              <label className="text-sm font-medium">Verification Code</label>
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
                {isFinalizing ? "Verifying..." : "Confirm Password Change"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
