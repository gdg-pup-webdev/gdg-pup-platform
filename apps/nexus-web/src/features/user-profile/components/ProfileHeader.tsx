/**
 * Profile header component
 *
 * Displays the user's name, role, and bio.
 * This is the main identifying information for the profile.
 */

import React from "react";
import { Badge, Stack, Text, Inline } from "@packages/spark-ui";

interface ProfileHeaderProps {
  // User's display name
  name: string;

  // User's role or title (e.g., "Developer", "Designer")
  role?: string;

  // User's biography or description
  bio?: string;
}

/**
 * Renders the main profile information (name, role, bio)
 */
export function ProfileHeader({ name, role, bio }: ProfileHeaderProps) {
  return (
    <Stack gap="md" className="text-center">
      {/* User's name */}
      <Text
        variant="heading-1"
        className="text-5xl bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-400 to-blue-400"
      >
        {name}
      </Text>

      {/* User's role (if provided) */}
      {role && (
        <Inline justify="center">
          <Badge variant="default" size="md">
            {role}
          </Badge>
        </Inline>
      )}

      {/* User's bio (if provided) */}
      {bio && (
        <Text variant="body-lg" className="text-gray-300 max-w-2xl mx-auto">
          {bio}
        </Text>
      )}
    </Stack>
  );
}
