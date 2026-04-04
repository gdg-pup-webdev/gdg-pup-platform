"use client";

import { ProfileCard } from "@/features/profile";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export default function ProfilePage() {
  return (
    <AdminPageScaffold pageKey="profile">
      <ProfileCard />
    </AdminPageScaffold>
  );
}
