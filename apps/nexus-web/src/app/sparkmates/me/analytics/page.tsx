"use client";

import { RequireAuthenticated } from "@/features/authentication/components/RequireAuthenticated";
import { AnalyticsPageContent } from "@/features/sparkmates/components/analyticspage/AnalyticsPageContent";

export default function AnalyticsPage() {
  return (
    <RequireAuthenticated>
      <AnalyticsPageContent />
    </RequireAuthenticated>
  );
}
