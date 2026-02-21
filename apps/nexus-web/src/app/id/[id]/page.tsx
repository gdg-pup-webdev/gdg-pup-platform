/**
 * User Profile Page - Route Handler
 *
 * This page displays a user's complete profile information.
 * It extracts the user ID from the URL and renders the ProfileCard component.
 *
 * Route: /id/[id]
 * Example: /id/user-123
 */

"use client";

import { use } from "react";
import { ProfileCard } from "@/features/user-profile";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise (required in Next.js 15+)
  const { id } = use(params);

  // Render the ProfileCard component with the user ID
  // The ProfileCard handles all the data fetching, loading states, and rendering
  return <ProfileCard userId={id} showActions isOwnProfile={false} />;
}
