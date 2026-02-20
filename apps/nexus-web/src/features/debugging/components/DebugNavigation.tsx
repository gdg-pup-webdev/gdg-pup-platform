/**
 * DebugNavigation Component
 * 
 * Navigation component for debugging pages with Google Material Design styling.
 */

"use client";

import React from "react";
import Link from "next/link";
import { Card } from '@packages/spark-ui';

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
            ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 shadow-md"
            : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <h3
            className={`font-semibold text-lg ${
              active ? "text-blue-700" : "text-gray-900 group-hover:text-blue-600"
            }`}
          >
            {label}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </div>
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
    <Card className="bg-gradient-to-br from-gray-50 to-white">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🧭</span>
          Debug Tools Navigation
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Access debugging tools and utilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      {/* Quick Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 <strong>Tip:</strong> Use these tools to test authentication flows,
          inspect tokens, and debug API calls during development.
        </p>
      </div>
    </Card>
  );
}
