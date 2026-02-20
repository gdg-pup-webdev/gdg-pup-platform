/**
 * EventsGrid Component
 * 
 * Grid layout for displaying multiple events with loading,
 * empty, and error states. Features Google Material Design.
 */

"use client";

import React from "react";
import { Event } from "../types";
import { EventCard } from "./EventCard";
import { Spinner } from '@packages/spark-ui';
import { Card } from '@packages/spark-ui';
import { Button } from '@packages/spark-ui';

interface EventsGridProps {
  events: Event[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

/**
 * Loading skeleton for events grid
 */
function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="h-96 animate-pulse">
          <div className="h-48 bg-gray-200 mb-4" />
          <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-10 bg-gray-200 rounded mt-4" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Empty state when no events found
 */
function EmptyState() {
  return (
    <Card className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-6xl mb-4">📅</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Events Found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        There are no events matching your filters. Try adjusting your search or
        check back later for new events.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={() => window.location.href = "/events"}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          View All Events
        </Button>
        <Button
          variant="secondary"
          onClick={() => window.location.reload()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Refresh Page
        </Button>
      </div>
    </Card>
  );
}

/**
 * Error state with retry option
 */
function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Card className="text-center py-16 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <div className="text-6xl mb-4">❌</div>
      <h3 className="text-2xl font-bold text-red-900 mb-2">
        Failed to Load Events
      </h3>
      <p className="text-red-700 mb-2 max-w-md mx-auto font-medium">
        {error.message}
      </p>
      <ul className="text-sm text-red-600 mb-6 max-w-md mx-auto text-left list-disc list-inside space-y-1">
        <li>Check your internet connection</li>
        <li>Verify the API server is running</li>
        <li>Try refreshing the page</li>
        <li>Contact support if the issue persists</li>
      </ul>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
        >
          <span className="flex items-center gap-2">
            <span>🔄</span>
            Try Again
          </span>
        </Button>
      )}
    </Card>
  );
}

/**
 * Grid component for displaying events
 * 
 * Automatically handles loading, empty, and error states
 * with Material Design aesthetics.
 */
export function EventsGrid({
  events,
  isLoading,
  error,
  onRetry,
}: EventsGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 font-medium">Loading events...</p>
        </div>
        <LoadingState />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Empty state
  if (events.length === 0) {
    return <EmptyState />;
  }

  // Success state - display events grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
