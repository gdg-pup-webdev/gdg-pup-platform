/**
 * TokenDisplay Component
 * 
 * Displays authentication tokens in a secure, copyable format
 * with Google Material Design styling.
 */

"use client";

import React, { useState } from "react";
import { Card } from '@packages/spark-ui';
import { Button } from '@packages/spark-ui';
import { Badge } from '@packages/spark-ui';

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
        bg: "from-blue-50 to-blue-100",
        border: "border-blue-300",
        text: "text-blue-700",
        button: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      },
      green: {
        bg: "from-green-50 to-green-100",
        border: "border-green-300",
        text: "text-green-700",
        button: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      },
      yellow: {
        bg: "from-yellow-50 to-yellow-100",
        border: "border-yellow-300",
        text: "text-yellow-700",
        button: "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
      },
      red: {
        bg: "from-red-50 to-red-100",
        border: "border-red-300",
        text: "text-red-700",
        button: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
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
    <Card className={`bg-linear-to-br ${colors.bg} border-2 ${colors.border}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className={`font-semibold ${colors.text}`}>{label}</h4>
          {description && (
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <Badge variant={token ? "success" : "default"}>
          {token ? "Available" : "Not Set"}
        </Badge>
      </div>

      {/* Token Display */}
      <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
        <code className="text-sm font-mono text-gray-800 break-all">
          {getDisplayToken()}
        </code>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          variant="secondary"
          size="sm"
          disabled={!token}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          <span className="flex items-center justify-center gap-1">
            <span>{isVisible ? "🙈" : "👁️"}</span>
            {isVisible ? "Hide" : "Show"}
          </span>
        </Button>
        
        <Button
          onClick={handleCopy}
          variant="secondary"
          size="sm"
          disabled={!token}
          className={`flex-1 bg-linear-to-r ${colors.button} text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50`}
        >
          <span className="flex items-center justify-center gap-1">
            <span>{copied ? "✅" : "📋"}</span>
            {copied ? "Copied!" : "Copy"}
          </span>
        </Button>
      </div>

      {/* Token Length Info */}
      {token && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Token length: <span className="font-semibold">{token.length}</span> characters
          </p>
        </div>
      )}
    </Card>
  );
}
