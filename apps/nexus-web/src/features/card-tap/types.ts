/**
 * Card Tap Feature Types
 * 
 * Type definitions for the card tap routing feature.
 * This feature checks a card's status and routes users to the appropriate page.
 */

/**
 * Possible status values for a card
 * 
 * - READY: Card is registered but not yet activated
 * - ACTIVE: Card is activated and linked to a user
 * - LOST: Card has been reported as lost/stolen
 */
export type CardStatus = "READY" | "ACTIVE" | "LOST";

/**
 * Card information from the API
 * 
 * @property status - Current status of the card
 * @property user_id - ID of the user who owns this card (if activated)
 * @property uid - Unique identifier of the card
 */
export interface Card {
  status: CardStatus;
  user_id: string | null;
  uid: string;
}

/**
 * User information from the API
 * 
 * @property id - Unique identifier for the user
 * @property name - User's display name
 * @property email - User's email address
 */
export interface User {
  id: string;
  name?: string;
  email?: string;
}

/**
 * Response from the card status API
 * 
 * @property status - Success or error indicator
 * @property message - Human-readable message
 * @property data - Contains card and user information
 */
export interface CardStatusResponse {
  status: "success" | "error";
  message?: string;
  data: {
    card: Card;
    user: User | null;
  };
}

/**
 * Routing decision based on card status
 * 
 * @property path - The URL path to redirect to
 * @property message - Human-readable explanation of the routing decision
 */
export interface RoutingDecision {
  path: string;
  message: string;
}
