/**
 * Card Activation API
 *
 * This module handles the API call to activate a card.
 * It communicates with the Identity API to link a physical card to a user's account.
 */

import type { ActivateCardRequest, ActivateCardResponse } from "../types";

/**
 * Activates a card by linking it to a user's account
 *
 * This function makes a POST request to the Identity API to activate a card.
 * The card must be in "READY" status to be activated.
 *
 * @param cardUid - The unique identifier of the card (from NFC scan or QR code)
 * @param userId - The ID of the user who will own this card
 * @param token - JWT authentication token for the API request
 *
 * @returns Promise with the activation response
 * @throws Error if the activation fails or the API returns an error
 *
 * @example
 * ```typescript
 * try {
 *   const result = await activateCard("ABC123", "user-456", "jwt-token");
 *   console.log("Card activated successfully!");
 * } catch (error) {
 *   console.error("Failed to activate card:", error.message);
 * }
 * ```
 */
export async function activateCard(
  cardUid: string,
  userId: string,
  token: string,
): Promise<ActivateCardResponse> {
  // Get the API URL from environment variables or use default localhost
  const apiUrl =
    process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:8100";

  // Ensure the URL has a trailing slash for proper path construction
  const baseUrl = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

  // Make the API request
  const response = await fetch(
    `${baseUrl}api/card-system/cards/${cardUid}/activate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          userId,
        },
      }),
    },
  );

  // Parse the JSON response
  const json = await response.json();

  // If the request wasn't successful, throw an error
  if (!response.ok) {
    throw new Error(json.message || "Failed to activate card");
  }

  // Return the successful response
  return json;
}
