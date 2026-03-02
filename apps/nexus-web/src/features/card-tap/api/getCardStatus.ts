/**
 * Card Status API
 * 
 * This module handles fetching the status of a card from the Identity API.
 * The status tells us if the card is ready, active, or lost.
 */

import type { CardStatusResponse } from "../types";

/**
 * Fetches the current status of a card
 * 
 * This function queries the Identity API to get information about a card,
 * including its current status and the user it belongs to (if activated).
 * 
 * @param cardUid - The unique identifier of the card (from NFC/QR scan)
 * 
 * @returns Promise with card status information
 * @throws Error if the API request fails
 * 
 * @example
 * ```typescript
 * try {
 *   const status = await getCardStatus("ABC123");
 *   console.log("Card status:", status.data.card.status);
 * } catch (error) {
 *   console.error("Failed to get card status:", error);
 * }
 * ```
 */
export async function getCardStatus(
  cardUid: string,
): Promise<CardStatusResponse> {
  // Get the API URL from environment variables or use localhost
  const apiUrl =
    process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:8100";

  // Make the API request
  const response = await fetch(`${apiUrl}/api/card-system/cards/${cardUid}/status`);

  // Parse the response
  const json = await response.json();

  // Handle 404 (card not found) specially
  if (response.status === 404) {
    throw new Error("This card is not registered in the system.");
  }

  // Check if the API returned an error
  if (json.status !== "success") {
    throw new Error(json.message || "Failed to check card status");
  }

  return json;
}
