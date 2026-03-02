/**
 * Loading State Component
 * 
 * Shows a loading spinner when checking authentication status.
 * This provides visual feedback to users while we verify their login status.
 */

import React from "react";
import { Stack, Text } from '@packages/spark-ui';

/**
 * Loading state shown while checking authentication
 * 
 * Displays an animated spinner and message to let users know
 * that we're checking if they're logged in.
 */
export const LoadingState: React.FC = () => {
  return (
    <Stack gap="md" className="items-center py-8">
      {/* Spinning loader */}
      <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-white rounded-full"></div>
      
      {/* Loading message */}
      <Text variant="body-sm" className="text-zinc-400">Checking authentication...</Text>
    </Stack>
  );
};
