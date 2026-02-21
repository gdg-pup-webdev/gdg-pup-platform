/**
 * Loading state component for the profile page
 *
 * Displays a skeleton loader while user data is being fetched.
 * This provides visual feedback that content is loading.
 */

import React from "react";
import {
  Spinner,
  Container,
  Stack,
  Text,
  Grid,
  Skeleton,
  Inline,
} from "@packages/spark-ui";

export function LoadingState() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tr from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Loading content */}
      <div className="relative z-10">
        <Container maxWidth="lg" className="py-12">
          <Stack gap="xl" className="text-center">
            {/* Spinner */}
            <Inline justify="center">
              <Spinner size="lg" />
            </Inline>

            {/* Loading text */}
            <Stack gap="xs">
              <Text variant="heading-2" className="text-white">
                Loading Profile...
              </Text>
              <Text variant="body" className="text-gray-400">
                Please wait while we fetch the user information
              </Text>
            </Stack>

            {/* Skeleton cards */}
            <Stack gap="md" className="mt-12">
              <Skeleton className="h-48 w-full" />
              <Grid gap="md" className="grid-cols-1 md:grid-cols-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </Grid>
            </Stack>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
