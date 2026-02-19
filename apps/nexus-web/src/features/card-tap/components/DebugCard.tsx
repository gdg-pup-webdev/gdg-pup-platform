/**
 * Debug Card Component
 * 
 * Shows detailed card information for testing/debugging.
 * This is useful during development to see exactly what data
 * we're getting from the API before redirecting.
 */

import React from "react";
import type { Card, User, RoutingDecision } from "../types";

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
      <h1 className="text-3xl font-bold text-green-500">Testing Mode</h1>

      {/* Info card */}
      <div className="w-full max-w-md space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        {/* Status message */}
        <div>
          <h2 className="text-sm font-medium text-zinc-400">Status</h2>
          <p className="text-lg font-semibold">{routingDecision.message}</p>
        </div>

        {/* Card status */}
        <div>
          <h2 className="text-sm font-medium text-zinc-400">Card Status</h2>
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
        </div>

        {/* Redirect target */}
        <div>
          <h2 className="text-sm font-medium text-zinc-400">Redirect Target</h2>
          <code className="block rounded bg-zinc-950 p-2 text-blue-400 break-all">
            {routingDecision.path}
          </code>
        </div>

        {/* Raw data */}
        <div>
          <h2 className="text-sm font-medium text-zinc-400 mb-2">Raw Data</h2>
          <details className="group">
            <summary className="cursor-pointer text-sm text-blue-400 hover:text-blue-300">
              Click to view JSON
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded bg-zinc-950 p-2 text-xs text-zinc-500">
              {JSON.stringify({ card, user }, null, 2)}
            </pre>
          </details>
        </div>

        {/* Proceed button */}
        <button
          onClick={onProceed}
          className="w-full rounded bg-white py-2 font-bold text-black hover:bg-zinc-200 transition-colors"
        >
          Proceed to Redirect
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-zinc-600 max-w-md text-center">
        This is a debug view. In production, the redirect happens automatically.
      </p>
    </div>
  );
};
