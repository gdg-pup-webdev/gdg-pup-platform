/**
 * Auth Prompt Component
 *
 * Prompts unauthenticated users to log in before activating a card.
 * Shows a warning message and Google sign-in button.
 */

import React from "react";
import { Stack, Inline, Text } from "@packages/spark-ui";

interface AuthPromptProps {
  /** Function to trigger Google login */
  onLoginClick: () => void;
}

/**
 * Authentication prompt for unauthenticated users
 *
 * This component is shown when a user tries to activate a card
 * but isn't logged in. It explains why login is needed and provides
 * a Google sign-in button.
 */
export const AuthPrompt: React.FC<AuthPromptProps> = ({ onLoginClick }) => {
  return (
    <Stack gap="lg">
      {/* Warning message */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
        <Text variant="body-sm" className="text-yellow-200">
          You need to be logged in to link this card to your account.
        </Text>
      </div>

      {/* Google sign-in button */}
      <button
        onClick={onLoginClick}
        className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
      >
        {/* Google logo */}
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Continue with Google</span>
      </button>
    </Stack>
  );
};
