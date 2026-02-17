/**
 * Loading State Component
 * 
 * Shows a loading spinner when checking authentication status.
 * This provides visual feedback to users while we verify their login status.
 */

import React from "react";

/**
 * Loading state shown while checking authentication
 * 
 * Displays an animated spinner and message to let users know
 * that we're checking if they're logged in.
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-8">
      {/* Spinning loader */}
      <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-white rounded-full mb-4"></div>
      
      {/* Loading message */}
      <p className="text-zinc-400 text-sm">Checking authentication...</p>
    </div>
  );
};
