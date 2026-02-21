/**
 * Error Card Component
 *
 * Displays error messages when card status check fails.
 * Shows a red error state with the error message.
 */

import React from "react";
import { Stack, Text } from "@packages/spark-ui";

interface ErrorCardProps {
  /** The error message to display */
  message: string;
}

/**
 * Error state for card tap
 *
 * Shows when:
 * - Card is not found in the system
 * - API request fails
 * - Card is in LOST status
 */
export const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <Stack gap="md" className="text-center max-w-md p-6">
        {/* Error icon */}
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error title */}
        <Text variant="heading-2" className="text-red-500">
          Card Error
        </Text>

        {/* Error message */}
        <Text variant="body" className="text-zinc-400">
          {message}
        </Text>

        {/* Optional: Add a back button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          Go Home
        </button>
      </Stack>
    </div>
  );
};
