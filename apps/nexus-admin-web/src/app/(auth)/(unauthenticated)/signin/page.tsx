"use client";

import { LoginForm } from "@/features/authentication/components/LoginForm";
import { AuthFormCard } from "@/features/authentication/components/AuthFormCard";

export default function SignInPage() {
  return (
    <AuthFormCard
      title="Welcome back, Sparkmate!"
      subtitle="Sign in using your GDG ID to access your profile, XPark Points, and account settings."
    >
      <LoginForm />
    </AuthFormCard>
  );
}
