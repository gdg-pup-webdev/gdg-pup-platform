/**
 * Activation Header Component
 * 
 * Displays the header section with icon, title, and card UID.
 * This helps users understand what card they're activating.
 */

import React from "react";
import { Stack, Text } from '@packages/spark-ui';

interface ActivationHeaderProps {
  /** The unique identifier of the card being activated */
  cardUid: string;
}

/**
 * Header component for the card activation page
 * 
 * Shows a lightning bolt icon, title, and the card's unique ID
 * to help users confirm they're activating the correct card.
 */
export const ActivationHeader: React.FC<ActivationHeaderProps> = ({
  cardUid,
}) => {
  return (
    <Stack gap="md" className="text-center mb-8">
      {/* Icon with gradient background */}
      <div className="mx-auto w-16 h-16 bg-linear-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      {/* Title with gradient text */}
      <Text variant="heading-2" className="bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
        Activate Nexus Card
      </Text>

      {/* Display the card UID in monospace font */}
      <Text variant="body-sm" className="text-zinc-500 font-mono">{cardUid}</Text>
    </Stack>
  );
};
