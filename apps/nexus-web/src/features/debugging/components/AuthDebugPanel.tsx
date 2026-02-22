/**
 * AuthDebugPanel Component
 * 
 * Displays authentication state and provides controls for testing
 * authentication flows. Features Google Material Design styling.
 */

"use client";

import React from "react";
import { useDebugAuth } from "../hooks/useDebugAuth";
import { toast } from "react-toastify";
import { Button, Card, Badge, Avatar, Stack, Inline, Text } from '@packages/spark-ui';

/**
 * Main authentication debugging panel
 * 
 * Provides controls for login/logout and displays current auth state
 * with Google Material Design aesthetics.
 */
export function AuthDebugPanel() {
  const {
    authState,
    loginWithGoogle,
    logout,
    copyToken,
    copyGoogleAccessToken,
    getFormattedAuthState,
  } = useDebugAuth();

  // Handle token copy with toast notification
  const handleCopyToken = async () => {
    const success = await copyToken();
    if (success) {
      toast.success("Token copied to clipboard!");
    } else {
      toast.error("No token available to copy");
    }
  };

  // Handle Google access token copy with toast notification
  const handleCopyGoogleAccessToken = async () => {
    const success = await copyGoogleAccessToken();
    if (success) {
      toast.success("Google Access Token copied!");
    } else {
      toast.error("No Google Access Token available");
    }
  };

  // Determine status badge color based on auth state
  const getStatusColor = () => {
    switch (authState.status) {
      case "authenticated":
        return "success";
      case "unauthenticated":
        return "destructive";
      case "checking":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Stack gap="lg">
      {/* Header Section */}
      <Inline align="center" justify="between">
        <Stack gap="none">
          <Text variant="heading-2">
            Authentication Debugger
          </Text>
          <Text variant="body-sm" className="text-gray-600">
            Test authentication flows and inspect tokens
          </Text>
        </Stack>
        <Badge variant={getStatusColor()}>
          {authState.status.toUpperCase()}
        </Badge>
      </Inline>

      {/* User Info Card */}
      {authState.user && (
        <Card className="bg-blue-50 border-blue-200 border">
          <Inline gap="md" align="center">
            <Avatar
              src={authState.user.user_metadata?.avatar_url}
              alt={authState.user.user_metadata?.name || authState.user.email || "User"}
              size="lg"
              fallback={authState.user.user_metadata?.name?.charAt(0) || authState.user.email?.charAt(0) || "U"}
              className="border-2 border-blue-500"
            />
            <Stack gap="none">
              <Text variant="heading-3" className="text-gray-900">
                {authState.user.user_metadata?.name || "User"}
              </Text>
              <Text variant="body-sm" className="text-gray-600">
                {authState.user.email || "No email"}
              </Text>
              <Text variant="caption" className="text-gray-500">
                User ID: {authState.user.id}
              </Text>
            </Stack>
          </Inline>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <Stack gap="md">
          <Text variant="heading-3">Authentication Controls</Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={loginWithGoogle}
              variant="default"
            >
              <Inline gap="xs" align="center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Login with Google
              </Inline>
            </Button>

          <Button
            onClick={logout}
            variant="default"
          >
            Logout
          </Button>

          <Button
            onClick={handleCopyToken}
            variant="default"
            disabled={!authState.token}
          >
            Copy Backend Token
          </Button>

          <Button
            onClick={handleCopyGoogleAccessToken}
            variant="default"
            disabled={!authState.googleAccessToken}
          >
            Copy Google Token
          </Button>
        </div>
        </Stack>
      </Card>

      {/* Auth State Display */}
      <Card className="bg-gray-50">
        <Stack gap="md">
          <Text variant="heading-3">Authentication State</Text>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono">
              {getFormattedAuthState()}
            </pre>
          </div>
        </Stack>
      </Card>
    </Stack>
  );
}
