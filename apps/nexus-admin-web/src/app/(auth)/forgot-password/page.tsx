"use client";

import { ForgotPasswordFlow } from "@/features/authentication/components/ForgotPasswordFlow";
import { AuthFormCard } from "@/features/authentication/components/AuthFormCard";

export default function ForgotPasswordPage() {
  return (
    <AuthFormCard
      title="Forgot Password?"
      subtitle="Don't worry! Enter your email and new password. We'll send an OTP to verify your identity."
    >
      <ForgotPasswordFlow />
    </AuthFormCard>
  );
}
