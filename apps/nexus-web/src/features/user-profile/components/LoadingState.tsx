/**
 * Loading state component for the profile page
 * 
 * Displays a skeleton loader while user data is being fetched.
 * This provides visual feedback that content is loading.
 */

import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export function LoadingState() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Loading content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Spinner */}
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Loading Profile...
            </h2>
            <p className="text-gray-400">
              Please wait while we fetch the user information
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="space-y-4 mt-12">
            <div className="h-48 bg-white/5 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
