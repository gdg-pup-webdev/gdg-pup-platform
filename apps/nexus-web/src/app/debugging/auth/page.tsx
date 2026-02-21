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
import { PageLayout, PageHeader } from "@/components/shared";

export default function AuthDebugPage() {
  const { authState } = useDebugAuth();

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <PageHeader
            title="🔐 Authentication Debugger"
            description="Test authentication flows and inspect tokens"
          />

          {/* Navigation */}
          <div className="mt-8">
            <DebugNavigation activePage="auth" />
          </div>

          {/* Main Debug Panel */}
          <div className="mt-8">
            <AuthDebugPanel />
          </div>

          {/* Token Displays */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
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
          </div>

          {/* API Tester */}
          <div className="mt-8">
            <ApiTester token={authState.googleAccessToken} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
