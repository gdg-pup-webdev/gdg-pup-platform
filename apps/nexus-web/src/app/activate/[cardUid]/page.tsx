/**
 * Card Activation Page (Route)
 * 
 * This page handles the /activate/[cardUid] route.
 * All the logic has been moved to the feature module for better organization.
 * 
 * The page's only job is to:
 * 1. Get the cardUid from the URL
 * 2. Render the ActivationCard component
 */

"use client";

import { useParams } from "next/navigation";
import { ActivationCard } from "@/features/card-activation";

export default function ActivateCardPage() {
  // Get the cardUid from the URL parameters
  // For example: /activate/ABC123 -> cardUid will be "ABC123"
  const { cardUid } = useParams();

  // Render the main feature component
  // All the logic is handled inside the ActivationCard component
  return <ActivationCard cardUid={cardUid as string} />;
}
