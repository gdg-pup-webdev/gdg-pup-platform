/**
 * Health Check Card Component
 * 
 * A reusable card that displays the health status of an API.
 * Shows health check results, loading states, and errors.
 */

import React from 'react';
import { Button, Card, Spinner, Badge, Stack, Text, Inline } from '@packages/spark-ui';
import { HealthCheckResponse } from '../types';

interface HealthCheckCardProps {
  // The name of the API being checked (e.g., "Nexus API", "Identity API")
  apiName: string;
  
  // The health check data (null if not checked yet)
  data: HealthCheckResponse | null;
  
  // Loading state
  isLoading: boolean;
  
  // Error message (null if no error)
  error: string | null;
  
  // Function to trigger the health check
  onCheck: () => void;
  
  // Whether the check has been run at least once
  isFetched: boolean;
}

/**
 * Displays a card with health check status and controls
 */
export function HealthCheckCard({
  apiName,
  data,
  isLoading,
  error,
  onCheck,
  isFetched,
}: HealthCheckCardProps) {
  return (
    <Card>
      <Stack gap="md" className="p-6">
        {/* Header with API name */}
        <Stack gap="xs" className="text-center">
          <Text variant="heading-2" className="text-gray-900">
            {apiName}
          </Text>
          <Text variant="body-sm" className="text-gray-500">
            Health Status Monitor
          </Text>
        </Stack>

        {/* Check button */}
        <Button
          variant="default"
          size="md"
          onClick={onCheck}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Inline gap="xs" align="center" justify="center">
              <Spinner size="sm" />
              <span>Checking...</span>
            </Inline>
          ) : (
            'Check API Health'
          )}
        </Button>

        {/* Status display */}
        {isFetched && (
          <Stack gap="xs">
            {/* Success state */}
            {!isLoading && !error && data && (
              <Stack gap="xs" className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <Inline align="center" justify="between">
                  <Text variant="label" className="text-green-900 dark:text-green-100">
                    ✓ Healthy
                  </Text>
                  <Badge variant="success" size="sm">
                    {data.status}
                  </Badge>
                </Inline>
                
                <Stack gap="xs" className="text-sm text-green-800 dark:text-green-200">
                  <Text variant="body-sm">
                    <strong>Message:</strong> {data.message}
                  </Text>
                  {data.timestamp && (
                    <Text variant="caption" className="text-green-600 dark:text-green-400">
                      <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
                    </Text>
                  )}
                  {data.version && (
                    <Text variant="caption" className="text-green-600 dark:text-green-400">
                      <strong>Version:</strong> {data.version}
                    </Text>
                  )}
                </Stack>
              </Stack>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <Stack gap="xs" className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <Inline align="center" justify="between">
                  <Text variant="label" className="text-red-900 dark:text-red-100">
                    ✗ Unhealthy
                  </Text>
                  <Badge variant="destructive" size="sm">
                    Error
                  </Badge>
                </Inline>
                
                <Stack gap="xs">
                  <Text variant="body-sm" className="text-red-800 dark:text-red-200 font-medium">
                    {error}
                  </Text>
                  
                  {/* Helpful suggestions based on error */}
                  <Stack gap="xs" className="pt-3 border-t border-red-200 dark:border-red-800">
                    <Text variant="caption" className="text-red-700 dark:text-red-300 font-semibold">
                      Troubleshooting:
                    </Text>
                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                      {error.includes('Failed to connect') && (
                        <>
                          <li>Check if the API server is running</li>
                          <li>Verify the API URL in your configuration</li>
                          <li>Check for network connectivity issues</li>
                        </>
                      )}
                      {error.includes('timed out') && (
                        <>
                          <li>The server may be slow or overloaded</li>
                          <li>Check your network connection</li>
                          <li>Try again in a few moments</li>
                        </>
                      )}
                      {!error.includes('Failed to connect') && !error.includes('timed out') && (
                        <>
                          <li>Check the server logs for errors</li>
                          <li>Verify API configuration</li>
                          <li>Contact system administrator if issue persists</li>
                        </>
                      )}
                    </ul>
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
