/**
 * Loading state component for the profile page
 * * Displays a skeleton loader while user data is being fetched.
 * This provides visual feedback that content is loading.
 */

import React from 'react';

export function ProfileLoadingState() {
  return (
    <div className=" min-h-screen relative overflow-hidden bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-32">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tr from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Loading content */}
      <div className="relative z-10">
        {/* Replaces Container maxWidth="lg" */}
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Replaces Stack gap="xl" */}
          <div className="flex flex-col gap-8 text-center">
            
            {/* Replaces Inline justify="center" & Spinner */}
            <div className="flex justify-center">
              <svg 
                className="animate-spin h-12 w-12 text-purple-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            {/* Replaces Stack gap="xs" */}
            <div className="flex flex-col gap-2">
              {/* Replaces Text variant="heading-2" */}
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Loading Profile...
              </h2>
              {/* Replaces Text variant="body" */}
              <p className="text-base text-gray-400">
                Please wait while we fetch the user information
              </p>
            </div>

            {/* Replaces Stack gap="md" mt-12 */}
            <div className="flex flex-col gap-4 mt-12">
              {/* Replaces Skeleton className="h-48 w-full" */}
              <div className="h-48 w-full bg-white/10 rounded-xl animate-pulse" />
              
              {/* Replaces Grid gap="md" className="grid-cols-1 md:grid-cols-2" */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {/* Replaces Skeleton className="h-32 w-full" */}
                <div className="h-32 w-full bg-white/10 rounded-xl animate-pulse" />
                <div className="h-32 w-full bg-white/10 rounded-xl animate-pulse" />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}