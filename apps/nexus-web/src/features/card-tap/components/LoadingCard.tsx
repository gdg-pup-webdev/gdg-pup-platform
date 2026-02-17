/**
 * Loading Card Component
 * 
 * Shows a loading animation while checking card status.
 * This provides visual feedback to users during the brief moment
 * while we're fetching card information.
 */

import React from "react";

/**
 * Loading state for card tap
 * 
 * Displays a spinner and message while the card status is being checked.
 */
export const LoadingCard: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        {/* Spinning animation */}
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-white"></div>
        
        {/* Loading message */}
        <p className="mt-4 text-zinc-400">Reading card...</p>
      </div>
    </div>
  );
};
