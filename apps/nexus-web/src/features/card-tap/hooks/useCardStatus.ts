/**
 * Card Status Hook
 *
 * Custom hook that fetches card status and determines routing.
 * Uses TanStack Query for efficient data fetching with automatic retries.
 */

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCardStatus } from "../api/getCardStatus";
import type { RoutingDecision } from "../types";

/**
 * Custom hook for card tap routing
 *
 * This hook:
 * 1. Fetches the card's status from the API
 * 2. Determines where to redirect based on the status
 * 3. Optionally auto-redirects (can be disabled for testing)
 *
 * @param cardUid - The unique identifier of the card
 * @param options.enableAutoRedirect - Whether to automatically redirect (default: true)
 *
 * @returns Object containing loading state, error, and routing information
 *
 * @example
 * ```typescript
 * function TapPage() {
 *   const { isLoading, error, routingDecision } = useCardStatus("ABC123");
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>Redirecting to {routingDecision.path}</div>;
 * }
 * ```
 */
export function useCardStatus(
  cardUid: string,
  options: { enableAutoRedirect?: boolean } = {},
) {
  const { enableAutoRedirect = true } = options;
  const router = useRouter();

  // Use TanStack Query to fetch card status
  // This gives us automatic loading states, error handling, and caching
  const query = useQuery({
    // Unique key for this query - allows React Query to cache results
    queryKey: ["cardStatus", cardUid],

    // Function that fetches the data
    queryFn: () => getCardStatus(cardUid),

    // Only run the query if we have a cardUid
    enabled: !!cardUid,

    // Don't retry on error (card not found is a valid state)
    retry: false,

    // Cache the result for 30 seconds
    staleTime: 30000,
  });

  /**
   * Determine where to redirect based on card status
   *
   * This function takes the card data and figures out which page
   * the user should be sent to.
   */
  const getRoutingDecision = (): RoutingDecision | null => {
    // If we don't have data yet, return null
    if (!query.data) return null;

    const { card, user } = query.data.data;

    // READY means the card needs to be activated
    if (card.status === "READY") {
      return {
        path: `/activate/${cardUid}`,
        message:
          "Card is ready for activation. Redirecting to activation page...",
      };
    }

    // ACTIVE means the card is linked to someone's profile
    if (card.status === "ACTIVE") {
      // Get the user ID from either the user object or the card
      const targetUserId = user?.id || card.user_id;

      return {
        path: `/id/${targetUserId}`,
        message: "Card is active. Redirecting to user profile...",
      };
    }

    // LOST or any other status
    return {
      path: "/",
      message: "This card has been reported as lost or is invalid.",
    };
  };

  // Get the routing decision
  const routingDecision = getRoutingDecision();

  /**
   * Auto-redirect effect
   *
   * If auto-redirect is enabled and we have a routing decision,
   * automatically navigate to the target page.
   */
  useEffect(() => {
    if (enableAutoRedirect && routingDecision && !query.isLoading) {
      // Use replace instead of push so users can't go "back" to this page
      router.replace(routingDecision.path);
    }
  }, [enableAutoRedirect, routingDecision, query.isLoading, router]);

  return {
    // Loading state - true while fetching card status
    isLoading: query.isLoading,

    // Error if the fetch failed
    error: query.error,

    // The card and user data from the API
    data: query.data?.data,

    // Where to redirect and why
    routingDecision,

    // Function to manually trigger the redirect
    redirect: () => {
      if (routingDecision) {
        router.replace(routingDecision.path);
      }
    },
  };
}
