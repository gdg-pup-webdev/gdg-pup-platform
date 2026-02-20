/**
 * DebugNavigation Component
 * 
 * Navigation component for debugging pages with Google Material Design styling.
 */

"use client";

import React from "react";
import Link from "next/link";
import { Card, Stack, Grid, Text, Inline } from '@packages/spark-ui';

interface NavLinkProps {
  href: string;
  label: string;
  icon: string;
  description: string;
  active?: boolean;
}

/**
 * Individual navigation link with hover effects
 */
function NavLink({ href, label, icon, description, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`
        group block p-4 rounded-lg border-2 transition-all
        ${
          active
            ? "bg-linear-to-br from-blue-50 to-blue-100 border-blue-500 shadow-md"
            : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105"
        }
      `}
    >
      <Inline gap="xs" align="start">
        <span className="text-3xl">{icon}</span>
        <Stack gap="xs" className="flex-1">
          <Text
            variant="label"
            className={active ? "text-blue-700" : "text-gray-900 group-hover:text-blue-600"}
          >
            {label}
          </Text>
          <Text variant="body-sm" className="text-gray-600">{description}</Text>
        </Stack>
        <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </Inline>
    </Link>
  );
}

interface DebugNavigationProps {
  /** Currently active page */
  activePage?: "index" | "auth" | "home";
}

/**
 * Navigation component for debugging tools
 * 
 * Provides quick access to different debugging pages with
 * Material Design aesthetics and visual feedback.
 */
export function DebugNavigation({ activePage }: DebugNavigationProps) {
  return (
    <Card className="bg-linear-to-br from-gray-50 to-white">
      <Stack gap="md">
        <Stack gap="xs">
          <Inline gap="xs" align="center">
            <Text variant="heading-3">🧭 Debug Tools Navigation</Text>
          </Inline>
          <Text variant="body-sm" className="text-gray-600">
            Access debugging tools and utilities
          </Text>
        </Stack>

        <Grid gap="md" className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <NavLink
            href="/debugging"
            label="Debug Home"
            icon="🏠"
            description="Main debugging dashboard"
            active={activePage === "index"}
          />
          
          <NavLink
            href="/debugging/auth"
            label="Auth Debugger"
            icon="🔐"
            description="Test authentication & tokens"
            active={activePage === "auth"}
          />
          
          <NavLink
            href="/"
            label="Home Page"
            icon="🌐"
            description="Return to main application"
            active={activePage === "home"}
          />
        </Grid>

        {/* Quick Info */}
        <Stack gap="xs" className="pt-4 border-t border-gray-200">
          <Text variant="caption" className="text-gray-500">
            💡 <strong>Tip:</strong> Use these tools to test authentication flows,
            inspect tokens, and debug API calls during development.
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}
