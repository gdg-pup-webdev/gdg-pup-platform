/**
 * ApiTester Component
 * 
 * Interactive tool for testing API endpoints with authentication tokens.
 * Features Google Material Design styling.
 */

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
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
        }
      );

      const endTime = performance.now();
      const data = await response.json();

      setResult({
        statusCode: response.status,
        success: response.ok,
        data: data,
        duration: Math.round(endTime - startTime),
        error: !response.ok ? data.error?.message || "Request failed" : undefined,
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
      <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <span className="text-2xl">🧪</span>
        API Endpoint Tester
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Test API endpoints using your current authentication tokens
      </p>

      {/* Test Actions */}
      <div className="space-y-3 mb-6">
        <Button
          onClick={handleTestGoogleClassroom}
          disabled={!token || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              Testing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg">📚</span>
              Test Google Classroom API
            </span>
          )}
        </Button>

        {!token && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Please login first to test API endpoints
            </p>
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          {/* Result Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Test Results</h4>
            <div className="flex items-center gap-2">
              <Badge variant={result.success ? "success" : "danger"}>
                {result.statusCode} {result.success ? "Success" : "Failed"}
              </Badge>
              <Badge variant="info">{result.duration}ms</Badge>
            </div>
          </div>

          {/* Success Response */}
          {result.success && result.data && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <h5 className="font-semibold text-green-900 mb-2">
                    Request Successful
                  </h5>
                  <div className="bg-white rounded p-3 border border-green-200">
                    <pre className="text-xs font-mono text-gray-800 overflow-x-auto max-h-64 overflow-y-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                  {result.data.courses && (
                    <p className="text-sm text-green-700 mt-2">
                      📊 Found {result.data.courses.length} courses
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Response */}
          {!result.success && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <h5 className="font-semibold text-red-900 mb-2">
                    Request Failed
                  </h5>
                  <p className="text-sm text-red-700 mb-3">
                    {result.error || "Unknown error occurred"}
                  </p>
                  <div className="bg-red-100 rounded p-3 text-xs font-mono text-red-900">
                    <p>Status Code: {result.statusCode}</p>
                    <p>Duration: {result.duration}ms</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
