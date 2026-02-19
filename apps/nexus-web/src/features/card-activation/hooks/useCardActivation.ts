/**
 * Card Activation Hook
 * 
 * This custom hook provides a simple interface for activating cards.
 * It uses TanStack Query (React Query) for handling async state management,
 * which gives us loading states, error handling, and automatic retries.
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { activateCard } from "../api/activateCard";
import type { CardActivationError } from "../types";

/**
 * Parameters needed for card activation
 */
interface UseCardActivationParams {
  /** The unique ID of the card to activate */
  cardUid: string;
  /** The ID of the user who will own this card */
  userId: string;
  /** JWT authentication token */
  token: string;
}

/**
 * Custom hook for card activation
 * 
 * This hook simplifies the card activation process by handling:
 * - API calls with proper error handling
 * - Loading states (isActivating)
 * - Success notifications
 * - Navigation after successful activation
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { mutate: activate, isActivating } = useCardActivation();
 * 
 *   const handleClick = () => {
 *     activate({
 *       cardUid: "ABC123",
 *       userId: "user-456",
 *       token: "jwt-token"
 *     });
 *   };
 * 
 *   return (
 *     <button onClick={handleClick} disabled={isActivating}>
 *       {isActivating ? "Activating..." : "Activate Card"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useCardActivation() {
  const router = useRouter();

  // useMutation is perfect for operations that change data (POST, PUT, DELETE)
  // It gives us loading state, error handling, and success callbacks
  const mutation = useMutation({
    // The mutation function that will be called
    mutationFn: async (params: UseCardActivationParams) => {
      return await activateCard(params.cardUid, params.userId, params.token);
    },

    // Called when the activation succeeds
    onSuccess: (data, variables) => {
      // Show success message to the user
      toast.success("Card activated successfully!");
      
      // Navigate to the user's profile page
      router.push(`/id/${variables.userId}`);
    },

    // Called when the activation fails
    onError: (error: CardActivationError) => {
      // Log the error for debugging
      console.error("Card activation failed:", error);
      
      // Show error message to the user
      toast.error(error.message || "Failed to activate card. Please try again.");
    },
  });

  return {
    // Function to call when you want to activate a card
    activate: mutation.mutate,
    
    // Boolean: true when activation is in progress
    isActivating: mutation.isPending,
    
    // Boolean: true if activation failed
    isError: mutation.isError,
    
    // The error object if activation failed
    error: mutation.error,
    
    // Reset the mutation state (useful if you want to try again)
    reset: mutation.reset,
  };
}
