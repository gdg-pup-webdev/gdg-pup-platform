"use client";

import { ProfileCard } from "@/features/profile";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile information.
          </p>
        </div>
        
        <ProfileCard />
      </div>
    </div>
  );
}
