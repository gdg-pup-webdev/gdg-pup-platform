"use client";

import { LearningResourceList } from "@/features/learning-resources";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export default function LearningResourcesPage() {
  return (
    <AdminPageScaffold pageKey="learningResources">
      <LearningResourceList />
    </AdminPageScaffold>
  );
}
