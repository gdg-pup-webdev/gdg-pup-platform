/**
 * Debugging Home Page
 *
 * Main debugging dashboard with navigation to debug tools.
 * Showcases modern Google Material Design styling.
 */

"use client";

import React from "react";
import { DebugNavigation } from "@/features/debugging";
<<<<<<< HEAD
import { PageLayout, PageHeader } from "@/components/shared";
import { Card } from "@packages/spark-ui";
=======
import { Card, Container, Stack, Grid } from '@packages/spark-ui';
import { HealthChecksGrid } from '@/features/health-checks';
>>>>>>> dev

export default function DebugPage() {
  return (
    <Container className="py-12">
      <Stack gap="xl">

          {/* Navigation */}
          <DebugNavigation activePage="index" />

          {/* Info Cards */}
          <Grid gap="lg" className="grid-cols-1 md:grid-cols-3">
            <Card className="bg-blue-50 border-2 border-blue-200">
              <div className="text-center">
                <div className="text-4xl mb-3">🔐</div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Authentication
                </h3>
                <p className="text-sm text-blue-800">
                  Test login flows, inspect tokens, and debug authentication
                  issues
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
          </Grid>

          {/* Developer Notes */}
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Development Only
                </h3>
                <p className="text-sm text-yellow-800">
                  These debugging tools are for development purposes only and
                  should not be accessible in production environments. Ensure
                  proper environment checks are in place before deployment.
                </p>
              </div>
            </div>
          </Card>

          {/* System Status */}
          <Stack gap="md">
            <Stack align="center" gap="sm">
              <h2 className="text-2xl font-bold text-gray-900">
                System Status
              </h2>
              <p className="text-gray-600">
                Real-time monitoring of platform services
              </p>
            </Stack>
            <HealthChecksGrid />
          </Stack>
      </Stack>
    </Container>
  );
}
