/**
 * Profile actions component
 *
 * Provides action buttons for interacting with the profile.
 * Actions like editing, sharing, following, etc.
 */

import React from "react";
import { Button, Inline } from "@packages/spark-ui";

interface ProfileActionsProps {
  // User ID for edit navigation
  userId: string;

  // Whether this is the current user's profile
  isOwnProfile?: boolean;

  // Callback for sharing the profile
  onShare?: () => void;
}

/**
 * Renders action buttons for the profile page
 */
export function ProfileActions({
  userId,
  isOwnProfile,
  onShare,
}: ProfileActionsProps) {
  // Handle share button click
  const handleShare = async () => {
    // If a custom share handler is provided, use it
    if (onShare) {
      onShare();
      return;
    }

    // Otherwise, use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "User Profile",
          text: "Check out this profile!",
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed, ignore
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: Copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }
  };

  return (
    <Inline justify="center" gap="md">
      {/* Edit Profile button (only for own profile) */}
      {isOwnProfile && (
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            // Navigate to edit profile page (to be implemented)
            console.log("Navigate to edit profile");
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="ml-2">Edit Profile</span>
        </Button>
      )}

      {/* Share Profile button */}
      <Button variant="secondary" size="md" onClick={handleShare}>
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span className="ml-2">Share</span>
      </Button>

      {/* Follow/Message button (for other users' profiles) */}
      {!isOwnProfile && (
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            // Implement follow/message functionality
            console.log("Follow or message user");
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="ml-2">Follow</span>
        </Button>
      )}
    </Inline>
  );
}
