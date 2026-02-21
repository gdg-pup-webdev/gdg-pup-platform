/**
 * EventsGrid Component
 *
 * Grid layout for displaying multiple events with loading,
 * empty, and error states.
 */

"use client";

import React from "react";
import { Event } from "../types";
import { EventCard } from "./EventCard";
import {
  Spinner,
  Card,
  Button,
  Grid,
  Stack,
  Inline,
  Text,
  Skeleton,
} from "@packages/spark-ui";

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
    <Grid gap="lg" className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="h-96">
          <Skeleton className="h-48 w-full" />
          <Stack gap="sm" className="p-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-full" />
          </Stack>
        </Card>
      ))}
    </Grid>
  );
}

/**
 * Empty state when no events found
 */
function EmptyState() {
  return (
    <Card className="text-center">
      <Stack gap="md" className="py-16 px-6" align="center">
        <div className="text-6xl">📅</div>
        <Stack gap="xs" align="center">
          <Text variant="heading-2">No Events Found</Text>
          <Text variant="body" color="secondary" className="max-w-md">
            There are no events matching your filters. Try adjusting your search
            or check back later for new events.
          </Text>
        </Stack>
        <Inline gap="sm" justify="center" wrap={true}>
          <Button
            variant="primary"
            onClick={() => (window.location.href = "/events")}
          >
            View All Events
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
}

/**
 * Error state with retry option
 */
function ErrorState({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <Stack gap="md" className="py-16 px-6" align="center">
        <div className="text-6xl">❌</div>
        <Stack gap="xs" align="center">
          <Text variant="heading-2" color="error">
            Failed to Load Events
          </Text>
          <Text
            variant="body"
            weight="medium"
            className="max-w-md text-red-700"
          >
            {error.message}
          </Text>
        </Stack>
        <Stack
          as="ul"
          gap="xs"
          className="text-sm text-red-600 max-w-md list-disc list-inside"
        >
          <li>Check your internet connection</li>
          <li>Verify the API server is running</li>
          <li>Try refreshing the page</li>
          <li>Contact support if the issue persists</li>
        </Stack>
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            <Inline gap="xs" align="center">
              <span>🔄</span>
              <span>Try Again</span>
            </Inline>
          </Button>
        )}
      </Stack>
    </Card>
  );
}

/**
 * Grid component for displaying events
 *
 * Automatically handles loading, empty, and error states
 * using SparkUI primitives.
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
      <Stack gap="lg">
        <Inline gap="sm" align="center" justify="center" className="py-8">
          <Spinner size="lg" />
          <Text variant="body" color="secondary" weight="medium">
            Loading events...
          </Text>
        </Inline>
        <LoadingState />
      </Stack>
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
    <Grid gap="lg" className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Grid>
  );
}
