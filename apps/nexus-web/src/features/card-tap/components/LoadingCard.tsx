/**
 * Loading Card Component
 *
 * Shows the GDG loading animation while checking card status.
 */

import React from "react";
import { LoadingScreen } from "@/components/shared";

export const LoadingCard: React.FC = () => {
  return <LoadingScreen message="Reading card..." />;
};
