/**
 * Card Tap Router Component
 * 
 * Main component that handles the card tap flow.
 * This component checks the card status and routes users accordingly.
 */

import React from "react";
import { useCardStatus } from "../hooks/useCardStatus";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { DebugCard } from "./DebugCard";

interface CardTapRouterProps {
  /** The unique identifier of the card */
  cardUid: string;
  /** Whether to enable debug mode (shows info before redirecting) */
  debugMode?: boolean;
}

/**
 * Card tap router component
 * 
 * This component is the entry point for the card tap feature.
 * It handles:
 * 1. Fetching card status from the API
 * 2. Showing loading state while fetching
 * 3. Showing error state if something goes wrong
 * 4. Routing to the appropriate page based on card status
 * 
 * @example
 * ```tsx
 * // Normal mode (auto-redirects)
 * <CardTapRouter cardUid="ABC123" />
 * 
 * // Debug mode (shows info before redirecting)
 * <CardTapRouter cardUid="ABC123" debugMode={true} />
 * ```
 */
export const CardTapRouter: React.FC<CardTapRouterProps> = ({
  cardUid,
  debugMode = false,
}) => {
  // Use our custom hook to handle card status and routing
  const { isLoading, error, data, routingDecision, redirect } = useCardStatus(
    cardUid,
    {
      // Disable auto-redirect in debug mode
      enableAutoRedirect: !debugMode,
    },
  );

  // Show loading state while fetching card status
  if (isLoading) {
    return <LoadingCard />;
  }

  // Show error if something went wrong
  if (error) {
    return <ErrorCard message={error.message} />;
  }

  // Show error if we don't have the data we need
  if (!data || !routingDecision) {
    return <ErrorCard message="Unable to process card information" />;
  }

  // In debug mode, show detailed information before redirecting
  if (debugMode) {
    return (
      <DebugCard
        card={data.card}
        user={data.user}
        routingDecision={routingDecision}
        onProceed={redirect}
      />
    );
  }

  // In normal mode, show a brief message while redirecting
  // (Usually won't be visible because redirect happens immediately)
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-white"></div>
        <p className="mt-4 text-zinc-400">{routingDecision.message}</p>
      </div>
    </div>
  );
};
