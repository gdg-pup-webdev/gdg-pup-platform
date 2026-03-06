/**
 * Authentication Debugging Page
 *
 * Provides tools for testing authentication, inspecting tokens,
 * and debugging API calls. Features modern Google Material Design.
 */

"use client";

import React from "react";
import {
  AuthDebugPanel,
  TokenDisplay,
  ApiTester,
  DebugNavigation,
  useDebugAuth,
} from "@/features/debugging";
import { Container, Stack, Grid } from "@packages/spark-ui";

export default function AuthDebugPage() {
  const { authState } = useDebugAuth();

  return (
    <Container className="py-12">
      <Stack gap="xl">

          {/* Navigation */}
          <DebugNavigation activePage="auth" />

          {/* Main Debug Panel */}
          <AuthDebugPanel />

          {/* Token Displays */}
          <Grid gap="lg" className="grid-cols-1 lg:grid-cols-2">
            <TokenDisplay
              token={authState.token}
              label="Backend Authentication Token"
              description="JWT token for Nexus/Identity API authentication"
              variant="blue"
            />

            <TokenDisplay
              token={authState.googleAccessToken}
              label="Google OAuth Access Token"
              description="Token for Google API requests (Classroom, etc.)"
              variant="green"
            />
          </Grid>

          {/* API Tester */}
          <ApiTester token={authState.googleAccessToken} />
      </Stack>
    </Container>
  );
}
