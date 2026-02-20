/**
 * Error state component for the profile page
 * 
 * Displays when there's an error fetching user data.
 * Provides user-friendly error messages and a retry option.
 */

import React from 'react';
import { Button } from '@packages/spark-ui';

interface ErrorStateProps {
  // The error message to display
  error: string;
  
  // The error type for specific handling
  errorType: 'USER_NOT_FOUND' | 'NETWORK_ERROR' | 'INVALID_USER_ID' | 'SERVER_ERROR' | null;
  
  // Function to retry loading the profile
  onRetry: () => void;
}

/**
 * Displays an error state with appropriate messaging and actions
 */
export function ErrorState({ error, errorType, onRetry }: ErrorStateProps) {
  // Customize the title based on error type
  const title = errorType === 'USER_NOT_FOUND' 
    ? 'User Not Found' 
    : 'Unable to Load Profile';

  // Provide helpful suggestions based on error type
  const suggestion = errorType === 'USER_NOT_FOUND'
    ? 'The user you are looking for does not exist or has been removed.'
    : errorType === 'NETWORK_ERROR'
    ? 'Please check your internet connection and try again.'
    : 'There was a problem loading this profile. Please try again later.';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-full blur-3xl" />

      {/* Error content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Error icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
          </div>

          {/* Error title */}
          <h1 className="text-4xl font-bold text-white">
            {title}
          </h1>

          {/* Error details */}
          <div className="space-y-3">
            <p className="text-xl text-gray-300">
              {suggestion}
            </p>
            
            {/* Technical error message (in a subtle way) */}
            <p className="text-sm text-gray-500 font-mono bg-black/20 p-3 rounded">
              {error}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <Button
              variant="primary"
              size="md"
              onClick={onRetry}
            >
              Try Again
            </Button>
            
            <Button
              variant="secondary"
              size="md"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
