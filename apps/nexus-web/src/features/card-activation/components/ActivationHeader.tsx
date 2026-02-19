/**
 * Activation Header Component
 * 
 * Displays the header section with icon, title, and card UID.
 * This helps users understand what card they're activating.
 */

import React from "react";

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
    <div className="text-center mb-8">
      {/* Icon with gradient background */}
      <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
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
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
        Activate Nexus Card
      </h1>

      {/* Display the card UID in monospace font */}
      <p className="text-zinc-500 text-sm mt-2 font-mono">{cardUid}</p>
    </div>
  );
};
