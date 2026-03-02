/**
 * Debug Card Component
 * 
 * Shows detailed card information for testing/debugging.
 * This is useful during development to see exactly what data
 * we're getting from the API before redirecting.
 */

import React from "react";
import type { Card, User, RoutingDecision } from "../types";
import { Stack, Text } from '@packages/spark-ui';

interface DebugCardProps {
  /** Card information from the API */
  card: Card;
  /** User information from the API (if card is activated) */
  user: User | null;
  /** The routing decision */
  routingDecision: RoutingDecision;
  /** Function to proceed with the redirect */
  onProceed: () => void;
}

/**
 * Debug/testing view for card tap
 * 
 * Shows all the data we got from the API and where we're about to redirect.
 * This helps developers verify that the routing logic is working correctly.
 * 
 * In production, you might want to hide this behind a feature flag
 * or only show it for admin users.
 */
export const DebugCard: React.FC<DebugCardProps> = ({
  card,
  user,
  routingDecision,
  onProceed,
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white gap-6 p-4">
      {/* Header */}
      <Text variant="heading-1" className="text-green-500">Testing Mode</Text>

      {/* Info card */}
      <Stack gap="md" className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        {/* Status message */}
        <Stack gap="xs">
          <Text variant="body-sm" className="text-zinc-400">Status</Text>
          <Text variant="heading-3">{routingDecision.message}</Text>
        </Stack>

        {/* Card status */}
        <Stack gap="xs">
          <Text variant="body-sm" className="text-zinc-400">Card Status</Text>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              card.status === "READY"
                ? "bg-yellow-500/20 text-yellow-300"
                : card.status === "ACTIVE"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {card.status}
          </span>
        </Stack>

        {/* Redirect target */}
        <Stack gap="xs">
          <Text variant="body-sm" className="text-zinc-400">Redirect Target</Text>
          <code className="block rounded bg-zinc-950 p-2 text-blue-400 break-all">
            {routingDecision.path}
          </code>
        </Stack>

        {/* Raw data */}
        <Stack gap="xs">
          <Text variant="body-sm" className="text-zinc-400">Raw Data</Text>
          <details className="group">
            <summary className="cursor-pointer text-sm text-blue-400 hover:text-blue-300">
              Click to view JSON
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded bg-zinc-950 p-2 text-xs text-zinc-500">
              {JSON.stringify({ card, user }, null, 2)}
            </pre>
          </details>
        </Stack>

        {/* Proceed button */}
        <button
          onClick={onProceed}
          className="w-full rounded bg-white py-2 font-bold text-black hover:bg-zinc-200 transition-colors"
        >
          Proceed to Redirect
        </button>
      </Stack>

      {/* Helper text */}
      <Text variant="caption" className="text-zinc-600 max-w-md text-center">
        This is a debug view. In production, the redirect happens automatically.
      </Text>
    </div>
  );
};
