"use client";

import { SignupFlow } from "@/features/authentication/components/SignupFlow";
import { AuthFormCard } from "@/features/authentication/components/AuthFormCard";

export default function SignUpPage() {
  return (
    <AuthFormCard
      title="Welcome, Sparkmate!"
      subtitle="Sign up using your GDG ID to access your profile, XPark Points, and account settings."
    >
      <SignupFlow />
    </AuthFormCard>
  );
}
