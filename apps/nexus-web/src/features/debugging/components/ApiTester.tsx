/**
 * ApiTester Component
 *
 * Interactive tool for testing API endpoints with authentication tokens.
 * Features Google Material Design styling.
 */

"use client";

import React, { useState } from "react";
import {
  Card,
  Button,
  Badge,
  Spinner,
  Stack,
  Inline,
  Text,
} from "@packages/spark-ui";
import { ApiTestResult } from "../types";

interface ApiTesterProps {
  /** Current authentication token */
  token: string | null;
}

/**
 * API testing tool component
 *
 * Allows developers to test API endpoints with the current authentication token.
 * Displays request/response details and timing information.
 */
export function ApiTester({ token }: ApiTesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiTestResult | null>(null);

  /**
   * Test Google Classroom API
   * Fetches the list of courses from Google Classroom
   */
  const handleTestGoogleClassroom = async () => {
    if (!token) return;

    setIsLoading(true);
    setResult(null);
    const startTime = performance.now();

    try {
      const response = await fetch(
        "https://classroom.googleapis.com/v1/courses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const endTime = performance.now();
      const data = await response.json();

      setResult({
        statusCode: response.status,
        success: response.ok,
        data: data,
        duration: Math.round(endTime - startTime),
        error: !response.ok
          ? data.error?.message || "Request failed"
          : undefined,
      });
    } catch (error) {
      const endTime = performance.now();
      setResult({
        statusCode: 0,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Math.round(endTime - startTime),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Stack gap="md">
        <Stack gap="xs">
          <Inline gap="xs" align="center">
            <Text variant="heading-3">🧪 API Endpoint Tester</Text>
          </Inline>
          <Text variant="body-sm" className="text-gray-600">
            Test API endpoints using your current authentication tokens
          </Text>
        </Stack>

        {/* Test Actions */}
        <Stack gap="xs">
          <Button
            variant="primary"
            onClick={handleTestGoogleClassroom}
            disabled={!token || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Inline gap="xs" align="center" justify="center">
                <Spinner size="sm" />
                <span>Testing...</span>
              </Inline>
            ) : (
              <Inline gap="xs" align="center" justify="center">
                <span className="text-lg">📚</span>
                <span>Test Google Classroom API</span>
              </Inline>
            )}
          </Button>

          {!token && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <Text variant="body-sm" className="text-yellow-800">
                ⚠️ Please login first to test API endpoints
              </Text>
            </div>
          )}
        </Stack>

        {/* Results Display */}
        {result && (
          <Stack gap="md">
            {/* Result Header */}
            <Inline align="center" justify="between">
              <Text variant="label">Test Results</Text>
              <Inline gap="xs">
                <Badge variant={result.success ? "success" : "destructive"}>
                  {result.statusCode} {result.success ? "Success" : "Failed"}
                </Badge>
                <Badge variant="default">{result.duration}ms</Badge>
              </Inline>
            </Inline>

            {/* Success Response */}
            {result.success && result.data && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <Inline gap="xs" align="start">
                  <span className="text-2xl">✅</span>
                  <Stack gap="xs" className="flex-1">
                    <Text variant="label" className="text-green-900">
                      Request Successful
                    </Text>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <pre className="text-xs font-mono text-gray-800 overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                    {result.data.courses && (
                      <Text variant="body-sm" className="text-green-700">
                        📊 Found {result.data.courses.length} courses
                      </Text>
                    )}
                  </Stack>
                </Inline>
              </div>
            )}

            {/* Error Response */}
            {!result.success && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <Inline gap="xs" align="start">
                  <span className="text-2xl">❌</span>
                  <Stack gap="xs" className="flex-1">
                    <Text variant="label" className="text-red-900">
                      Request Failed
                    </Text>
                    <Text variant="body-sm" className="text-red-700">
                      {result.error || "Unknown error occurred"}
                    </Text>
                    <div className="bg-red-100 rounded p-3 text-xs font-mono text-red-900">
                      <p>Status Code: {result.statusCode}</p>
                      <p>Duration: {result.duration}ms</p>
                    </div>
                  </Stack>
                </Inline>
              </div>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
