/**
 * Debugging Home Page
 * 
 * Main debugging dashboard with navigation to debug tools.
 * Showcases modern Google Material Design styling.
 */

"use client";

import React from "react";
import { DebugNavigation } from "@/features/debugging";
import { PageLayout, PageHeader } from "@/components/shared";
import { Card } from "@/components/ui/Card";

export default function DebugPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <PageHeader
            title="🛠️ Debug Tools"
            description="Developer utilities for testing and debugging"
          />

          {/* Navigation */}
          <div className="mt-8">
            <DebugNavigation activePage="index" />
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-blue-50 border-2 border-blue-200">
              <div className="text-center">
                <div className="text-4xl mb-3">🔐</div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Authentication
                </h3>
                <p className="text-sm text-blue-800">
                  Test login flows, inspect tokens, and debug authentication issues
                </p>
              </div>
            </Card>

            <Card className="bg-green-50 border-2 border-green-200">
              <div className="text-center">
                <div className="text-4xl mb-3">🧪</div>
                <h3 className="font-semibold text-green-900 mb-2">
                  API Testing
                </h3>
                <p className="text-sm text-green-800">
                  Test API endpoints, inspect responses, and measure performance
                </p>
              </div>
            </Card>

            <Card className="bg-purple-50 border-2 border-purple-200">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  State Inspector
                </h3>
                <p className="text-sm text-purple-800">
                  View application state, context values, and runtime data
                </p>
              </div>
            </Card>
          </div>

          {/* Developer Notes */}
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Development Only
                </h3>
                <p className="text-sm text-yellow-800">
                  These debugging tools are for development purposes only and should
                  not be accessible in production environments. Ensure proper
                  environment checks are in place before deployment.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
