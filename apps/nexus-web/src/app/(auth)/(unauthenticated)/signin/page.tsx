"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/features/authentication/components/LoginForm";
import { AuthFormCard } from "@/features/authentication/components/AuthFormCard";

function resolveNotice(reason: string | null) {
  switch (reason) {
    case "oauth-complete":
      return "Google verification was completed. Please sign in to continue.";
    case "session-expired":
      return "Your session expired. Please sign in again.";
    case "verify-success":
      return "Email verification succeeded. You can sign in now.";
    default:
      return null;
  }
}

export default function SignInPage() {
  const searchParams = useSearchParams();
  const notice = resolveNotice(searchParams.get("reason"));

  return (
    <AuthFormCard
      title="Welcome back, Sparkmate!"
      subtitle="Sign in using your GDG ID to access your profile, XPark Points, and account settings."
    >
      {notice && (
        <div className="mb-4 rounded-lg border border-blue-300/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          {notice}
        </div>
      )}
      <LoginForm />
    </AuthFormCard>
  );
}
