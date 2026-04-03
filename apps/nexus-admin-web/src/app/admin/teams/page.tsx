"use client";

import { TeamList } from "@/features/teams";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export default function TeamsPage() {
  return (
    <AdminPageScaffold pageKey="teams">
      <TeamList />
    </AdminPageScaffold>
  );
}
