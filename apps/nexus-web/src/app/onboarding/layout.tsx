"use client";

import { RequireAuthenticated } from "@/features/authentication/components/RequireAuthenticated";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuthenticated>{children}</RequireAuthenticated>;
}
