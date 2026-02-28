/**
 * TokenDisplay Component
 * 
 * Displays authentication tokens in a secure, copyable format
 * with Google Material Design styling.
 */

"use client";

import React, { useState } from "react";
import { Card, Button, Badge, Stack, Inline, Text } from '@packages/spark-ui';

interface TokenDisplayProps {
  /** The token value to display */
  token: string | null;
  
  /** Label for the token */
  label: string;
  
  /** Optional description */
  description?: string;
  
  /** Color theme for the display */
  variant?: "blue" | "green" | "yellow" | "red";
}

/**
 * Component for displaying and copying authentication tokens
 * 
 * Features:
 * - Masked token display by default
 * - Toggle visibility
 * - One-click copy to clipboard
 * - Material Design aesthetics
 */
export function TokenDisplay({
  token,
  label,
  description,
  variant = "blue",
}: TokenDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!token) return;
    
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy token:", error);
    }
  };

  // Get color classes based on variant
  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
      },
      yellow: {
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        text: "text-yellow-700",
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
      },
    };
    return colors[variant];
  };

  const colors = getColorClasses();

  // Mask token for display
  const getDisplayToken = () => {
    if (!token) return "No token available";
    if (isVisible) return token;
    
    // Show first 10 and last 10 characters
    if (token.length > 20) {
      return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
    }
    return "••••••••••••••••";
  };

  return (
    <Card className={`${colors.bg} border-2 ${colors.border}`}>
      <Stack gap="xs">
        {/* Header */}
        <Inline align="center" justify="between">
          <Stack gap="none">
            <Text variant="label" className={colors.text}>{label}</Text>
            {description && (
              <Text variant="caption" className="text-gray-600">{description}</Text>
            )}
          </Stack>
          <Badge variant={token ? "success" : "default"}>
            {token ? "Available" : "Not Set"}
          </Badge>
        </Inline>

        {/* Token Display */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <code className="text-sm font-mono text-gray-800 break-all">
            {getDisplayToken()}
          </code>
        </div>

        {/* Action Buttons */}
        <Inline gap="xs">
          <Button
            onClick={() => setIsVisible(!isVisible)}
            variant="default"
            size="sm"
            disabled={!token}
            className="flex-1"
          >
            <Inline gap="none" align="center" justify="center">
              <span>{isVisible ? "🙈" : "👁️"}</span>
              <span className="ml-1">{isVisible ? "Hide" : "Show"}</span>
            </Inline>
          </Button>
          
          <Button
            onClick={handleCopy}
            variant="default"
            size="sm"
            disabled={!token}
            className="flex-1"
          >
            <Inline gap="none" align="center" justify="center">
              <span>{copied ? "✅" : "📋"}</span>
              <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
            </Inline>
          </Button>
        </Inline>

        {/* Token Length Info */}
        {token && (
          <Stack gap="none" className="pt-3 border-t border-gray-200">
            <Text variant="caption" className="text-gray-500">
              Token length: <span className="font-semibold">{token.length}</span> characters
            </Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
