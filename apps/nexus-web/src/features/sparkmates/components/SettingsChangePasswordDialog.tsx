"use client";

import { useState } from "react";
import { Modal, Button, Text, Input } from "@packages/spark-ui";
import { toast } from "react-toastify";
import { useChangePasswordInitiate } from "../hooks/useChangePasswordInitiate";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { cn } from "@/lib/utils";

interface SettingsChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] focus-within:p-[2px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_0_10px_rgba(251,44,54,0.35),0_0_20px_rgba(240,177,0,0.3),0_0_32px_rgba(43,127,255,0.4)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles =
  "!h-auto py-2 px-3 sm:py-2.5 sm:px-4 !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";

function StrengthRule({
  met,
  label,
}: {
  met: boolean;
  label: string;
}) {
  return (
    <li className={cn("flex items-center gap-1.5 text-xs", met ? "text-green-400" : "text-zinc-500")}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", met ? "bg-green-400" : "bg-zinc-600")} />
      {label}
    </li>
  );
}

export const SettingsChangePasswordDialog = ({
  open,
  onOpenChange,
}: SettingsChangePasswordDialogProps) => {
  const { decodedToken } = useAuthContext();
  const { mutateAsync: initiatePasswordChange, isPending } = useChangePasswordInitiate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength rules
  const rules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    noSpaces: !/\s/.test(newPassword) && newPassword.length > 0,
  };

  const allRulesMet = Object.values(rules).every(Boolean);

  const resetForm = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRulesMet) {
      toast.error("Password does not meet all requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const email = decodedToken?.email;
    if (!email) {
      toast.error("Unable to identify your account. Please log in again.");
      return;
    }

    try {
      // Use existing initiate flow — the server sends OTP to email.
      // Pass a placeholder for pass (the backend validates via token if available).
      await initiatePasswordChange({
        data: {
          email,
          pass: "", // user is already authenticated
          newPass: newPassword,
        },
      });
      toast.success("Password changed successfully.");
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password.");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm();
        onOpenChange(val);
      }}
      scrollBehavior="inside"
      size="sm"
      className="bg-transparent border-none p-0 !shadow-none isolate max-w-[95vw] sm:max-w-md"
    >
      <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/90 backdrop-blur-2xl px-6 py-8 sm:px-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header */}
          <div>
            <Text variant="heading-6" weight="bold" gradient="white-yellow">
              Change Password
            </Text>
            <Text variant="body-sm" className="text-zinc-400 mt-1">
              Your new password must be different from previously used passwords.
            </Text>
          </div>

          {/* New Password */}
          <div className="space-y-1.5 flex flex-col">
            <Text variant="body-sm" className="text-zinc-300 font-medium">
              New Password
            </Text>
            <StyledInputContainer>
              <div className="relative flex items-center bg-[#0a162a] rounded-[7px] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d] transition-colors">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter Your New Password"
                  containerClassName={cn(inputBaseStyles, "pr-10")}
                  className="text-white! py-2 sm:py-2.5 flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </StyledInputContainer>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 flex flex-col">
            <Text variant="body-sm" className="text-zinc-300 font-medium">
              Confirm Password
            </Text>
            <StyledInputContainer>
              <div className="relative flex items-center bg-[#0a162a] rounded-[7px] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d] transition-colors">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Your New Password"
                  containerClassName={cn(inputBaseStyles, "pr-10")}
                  className="text-white! py-2 sm:py-2.5 flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </StyledInputContainer>
          </div>

          {/* Password strength checklist */}
          <ul className="space-y-1 pl-1">
            <StrengthRule met={rules.length} label="At least 8 characters." />
            <StrengthRule met={rules.uppercase} label="At least one uppercase letter (A-Z)." />
            <StrengthRule met={rules.lowercase} label="At least one lowercase letter (a-z)." />
            <StrengthRule met={rules.number} label="At least one number (0-9)." />
            <StrengthRule met={rules.special} label={`At least one special character (!@#$% ^)`} />
            <StrengthRule met={rules.noSpaces} label="No spaces in between." />
          </ul>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              type="button"
              className="h-auto py-2 px-5"
              onClick={() => { resetForm(); onOpenChange(false); }}
            >
              Forgot Password
            </Button>
            <Button
              variant="colored"
              subVariant="blue"
              type="submit"
              className="h-auto py-2 px-5"
              disabled={isPending || !allRulesMet || newPassword !== confirmPassword}
            >
              {isPending ? "Saving..." : "Create New Password"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
