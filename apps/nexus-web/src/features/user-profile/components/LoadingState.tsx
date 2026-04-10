/**
 * Loading state component for the profile page
 * Displays the GDG loading screen while user data is being fetched.
 */

import React from 'react';
import { LoadingScreen } from '@/components/shared';

export function LoadingState() {
  return <LoadingScreen message="Loading Profile..." />;
}