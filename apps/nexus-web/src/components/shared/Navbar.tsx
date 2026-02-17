"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/providers/AuthProvider";
import { Avatar } from "@/components/ui";

export const Navbar: React.FC = () => {
  const { user, loginWithGoogle, logout, status } = useAuthContext();
  const [isDebugMenuOpen, setIsDebugMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">GDG PUP</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-600 transition-colors">
              Events
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-blue-600 transition-colors">
              Community
            </Link>
            <Link href="/leaderboards" className="text-gray-700 hover:text-blue-600 transition-colors">
              Leaderboards
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            
            {/* Debug Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDebugMenuOpen(!isDebugMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                Debug
                <svg className={`w-4 h-4 transition-transform ${isDebugMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDebugMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <Link
                    href="/debugging"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsDebugMenuOpen(false)}
                  >
                    Debug Home
                  </Link>
                  <Link
                    href="/debugging/auth"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsDebugMenuOpen(false)}
                  >
                    Auth Debugging
                  </Link>
                  <Link
                    href="/testing"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsDebugMenuOpen(false)}
                  >
                    Testing Page
                  </Link>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsDebugMenuOpen(false)}
                  >
                    Admin Page
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {status === "checking" ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : user ? (
              <>
                <Link
                  href={`/id/${user.id}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Avatar 
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.full_name || user.email || "User"}
                    size="sm"
                    fallback={user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
