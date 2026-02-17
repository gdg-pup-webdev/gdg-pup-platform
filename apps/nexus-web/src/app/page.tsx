/**
 * Home Page
 * 
 * Landing page with API health check monitors.
 * Displays the status of Nexus API and Identity API.
 */

'use client';

import { Header, Test } from '@packages/spark-ui';
import { HealthChecksGrid } from '@/features/health-checks';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-8 justify-center items-center p-4">
      {/* Page header */}
      <div className="text-center space-y-4">
        <Header>Nexus Web</Header>
        <Test />
      </div>

      {/* Health checks grid */}
      <HealthChecksGrid />
    </div>
  );
}
