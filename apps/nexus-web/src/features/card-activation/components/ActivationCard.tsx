/**
 * Main Activation Card Component
 * 
 * This is the main component that brings together all the smaller pieces
 * of the card activation feature. It handles the different states:
 * - Loading (checking authentication)
 * - Unauthenticated (show login prompt)
 * - Authenticated (show confirmation)
 */

import React from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import { useCardActivation } from "../hooks/useCardActivation";
import { BackgroundGradients } from "./BackgroundGradients";
import { ActivationHeader } from "./ActivationHeader";
import { LoadingState } from "./LoadingState";
import { AuthPrompt } from "./AuthPrompt";
import { UserConfirmation } from "./UserConfirmation";
import { Text } from '@packages/spark-ui';

interface ActivationCardProps {
  /** The unique identifier of the card to activate */
  cardUid: string;
}

/**
 * Complete card activation interface
 * 
 * This component orchestrates the entire card activation flow:
 * 1. Checks if user is authenticated
 * 2. Shows login prompt if not authenticated
 * 3. Shows confirmation screen if authenticated
 * 4. Handles the activation process
 * 
 * @example
 * ```tsx
 * <ActivationCard cardUid="ABC123" />
 * ```
 */
export const ActivationCard: React.FC<ActivationCardProps> = ({ cardUid }) => {
  // Get authentication context
  // This gives us the current user, their token, and auth status
  const { user, loginWithGoogle, token, status: authStatus } = useAuthContext();

  // Get card activation function from our custom hook
  const { activate, isActivating } = useCardActivation();

  /**
   * Handle the activation confirmation
   * 
   * Called when the user clicks "Confirm Activation".
   * Validates that we have all required data, then calls the activation API.
   */
  const handleActivate = () => {
    // Safety check: Make sure we have a user and token
    if (!user || !token) {
      console.error("Missing user or token");
      return;
    }

    // Call the activation mutation
    activate({
      cardUid,
      userId: user.id,
      token,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-4">
      {/* Animated background gradients */}
      <BackgroundGradients />

      {/* Main card container */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        {/* Header with icon and card UID */}
        <ActivationHeader cardUid={cardUid} />

        {/* Content area - changes based on auth status */}
        {authStatus === "checking" ? (
          // Show loading spinner while checking authentication
          <LoadingState />
        ) : !user ? (
          // Show login prompt if user is not authenticated
          <AuthPrompt onLoginClick={loginWithGoogle} />
        ) : (
          // Show confirmation screen if user is authenticated
          <UserConfirmation
            user={user}
            isActivating={isActivating}
            onConfirm={handleActivate}
          />
        )}

        {/* Footer with disclaimer */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <Text variant="caption" className="text-zinc-600">
            By activating, you agree to link this physical card to your digital
            profile.
          </Text>
        </div>
      </div>
    </div>
  );
};
