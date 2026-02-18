/**
 * Health Checks Grid Component
 * 
 * Main component that orchestrates all health check cards.
 * Displays Nexus API and Identity API health checks side-by-side.
 */

import React from 'react';
import { HealthCheckCard } from './HealthCheckCard';
import { useNexusHealthCheck, useIdentityHealthCheck } from '../hooks/useHealthChecks';

/**
 * Displays a grid of health check cards for all APIs
 */
export function HealthChecksGrid() {
  // Get health check hooks for both APIs
  const nexusHealth = useNexusHealthCheck();
  const identityHealth = useIdentityHealthCheck();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Grid container - responsive: 1 column on mobile, 2 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nexus API Health Check */}
        <HealthCheckCard
          apiName="Nexus API"
          data={nexusHealth.data}
          isLoading={nexusHealth.isLoading}
          error={nexusHealth.error}
          onCheck={nexusHealth.refetch}
          isFetched={nexusHealth.isFetched}
        />

        {/* Identity API Health Check */}
        <HealthCheckCard
          apiName="Identity API"
          data={identityHealth.data}
          isLoading={identityHealth.isLoading}
          error={identityHealth.error}
          onCheck={identityHealth.refetch}
          isFetched={identityHealth.isFetched}
        />
      </div>

      {/* Optional: Add a "Check All" button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            nexusHealth.refetch();
            identityHealth.refetch();
          }}
          className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors underline"
          disabled={nexusHealth.isLoading || identityHealth.isLoading}
        >
          Check All APIs
        </button>
      </div>
    </div>
  );
}
