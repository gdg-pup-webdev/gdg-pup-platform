/**
 * User Confirmation Component
 * 
 * Shows the logged-in user's information and provides a button
 * to confirm they want to activate the card with their account.
 */

import React from "react";
import type { User } from "@supabase/supabase-js";

interface UserConfirmationProps {
  /** The authenticated user object from Supabase */
  user: User;
  /** Whether the activation is currently in progress */
  isActivating: boolean;
  /** Function to call when user confirms activation */
  onConfirm: () => void;
}

/**
 * User confirmation screen for card activation
 * 
 * Shows the user's profile information and a button to confirm
 * that they want to link this card to their account.
 */
export const UserConfirmation: React.FC<UserConfirmationProps> = ({
  user,
  isActivating,
  onConfirm,
}) => {
  // Get user's display name from metadata, fallback to email
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email;

  // Get user's avatar URL or generate one using DiceBear API
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;

  return (
    <div className="space-y-6">
      {/* User info card */}
      <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-4">
        {/* User avatar */}
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-12 h-12 rounded-full bg-zinc-700"
        />

        {/* User details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-400">Activating as</p>
          <p className="font-semibold truncate">{displayName}</p>
        </div>
      </div>

      {/* Activation button */}
      <button
        onClick={onConfirm}
        disabled={isActivating}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isActivating ? (
          // Loading state
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
            <span>Activating...</span>
          </>
        ) : (
          // Ready state
          <span>Confirm Activation</span>
        )}
      </button>
    </div>
  );
};
