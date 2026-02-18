/**
 * Card Activation Feature Types
 * 
 * This file contains all TypeScript types used in the card activation feature.
 * These types ensure type safety and make the code more maintainable.
 */

/**
 * Request payload for activating a card
 * 
 * @property userId - The ID of the user who will own this card
 */
export interface ActivateCardRequest {
  userId: string;
}

/**
 * Response from the card activation API
 * 
 * @property status - Success or error status
 * @property message - Human-readable message about the operation
 * @property data - Optional additional data from the API
 */
export interface ActivateCardResponse {
  status: "success" | "error";
  message: string;
  data?: any;
}

/**
 * Error object when card activation fails
 * 
 * @property message - Description of what went wrong
 * @property code - Optional error code for specific error handling
 */
export interface CardActivationError {
  message: string;
  code?: string;
}
