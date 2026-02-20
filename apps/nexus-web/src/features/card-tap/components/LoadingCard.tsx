/**
 * Loading Card Component
 * 
 * Shows a loading animation while checking card status.
 * This provides visual feedback to users during the brief moment
 * while we're fetching card information.
 */

import React from "react";
import { Stack, Text } from '@packages/spark-ui';

/**
 * Loading state for card tap
 * 
 * Displays a spinner and message while the card status is being checked.
 */
export const LoadingCard: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <Stack gap="md" className="text-center">
        {/* Spinning animation */}
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-white"></div>
        
        {/* Loading message */}
        <Text variant="body" className="text-zinc-400">Reading card...</Text>
      </Stack>
    </div>
  );
};
