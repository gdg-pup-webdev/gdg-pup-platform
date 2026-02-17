/**
 * Health Check Card Component
 * 
 * A reusable card that displays the health status of an API.
 * Shows health check results, loading states, and errors.
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
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
      <div className="p-6 space-y-4 min-w-[320px]">
        {/* Header with API name */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {apiName}
          </h2>
          <p className="text-sm text-gray-500">
            Health Status Monitor
          </p>
        </div>

        {/* Check button */}
        <Button
          variant="primary"
          size="md"
          onClick={onCheck}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              Checking...
            </span>
          ) : (
            'Check API Health'
          )}
        </Button>

        {/* Status display */}
        {isFetched && (
          <div className="space-y-3">
            {/* Success state */}
            {!isLoading && !error && data && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    ✓ Healthy
                  </h3>
                  <Badge variant="success" size="sm">
                    {data.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <p>
                    <strong>Message:</strong> {data.message}
                  </p>
                  {data.timestamp && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
                    </p>
                  )}
                  {data.version && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      <strong>Version:</strong> {data.version}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    ✗ Unhealthy
                  </h3>
                  <Badge variant="danger" size="sm">
                    Error
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                    {error}
                  </p>
                  
                  {/* Helpful suggestions based on error */}
                  <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-700 dark:text-red-300 font-semibold mb-1">
                      Troubleshooting:
                    </p>
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
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
