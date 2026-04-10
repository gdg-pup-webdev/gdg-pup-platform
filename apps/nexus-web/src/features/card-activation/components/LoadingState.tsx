/**
 * Loading State Component
 *
 * Shows the GDG loading animation when checking authentication status.
 */

import React from "react";
import { LoadingScreen } from "@/components/shared";

export const LoadingState: React.FC = () => {
  return <LoadingScreen fullPage={false} message="Checking authentication..." />;
};
