/**
 * Health Checks Grid Component
 * 
 * Main component that orchestrates all health check cards.
 * Displays Nexus API and Identity API health checks side-by-side.
 */

import React from 'react';
import { Container, Grid, Stack, Button } from '@packages/spark-ui';
import { HealthCheckCard } from './HealthCheckCard';
import { useNexusHealthCheck  } from '../hooks/useHealthChecks';

/**
 * Displays a grid of health check cards for all APIs
 */
export function HealthChecksGrid() {
  // Get health check hooks for both APIs
  const nexusHealth = useNexusHealthCheck(); 

  return (
    <Container maxWidth="3xl">
      <Stack gap="lg">
        {/* Grid container - responsive: 1 column on mobile, 2 on desktop */}
        <Grid gap="lg" className="grid-cols-1 md:grid-cols-2">
          {/* Nexus API Health Check */}
          <HealthCheckCard
            apiName="Nexus API"
            data={nexusHealth.data}
            isLoading={nexusHealth.isLoading}
            error={nexusHealth.error}
            onCheck={nexusHealth.refetch}
            isFetched={nexusHealth.isFetched}
          />
 
        </Grid>

        {/* Optional: Add a "Check All" button */}
        <Stack align="center">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              nexusHealth.refetch(); 
            }}
            disabled={nexusHealth.isLoading }
          >
            Check All APIs
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
