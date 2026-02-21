/**
 * Card Tap Page (Route)
 *
 * This page handles the /tap/[cardUid] route.
 * It's triggered when someone scans an NFC card or QR code.
 *
 * The page's responsibility is to:
 * 1. Extract the cardUid from the URL
 * 2. Render the CardTapRouter component
 *
 * All logic has been moved to the card-tap feature for better organization.
 */

"use client";

import { useParams } from "next/navigation";
import { CardTapRouter } from "@/features/card-tap";

export default function TapRouterPage() {
  // Get the cardUid from the URL parameters
  // For example: /tap/ABC123 -> cardUid will be "ABC123"
  const { cardUid } = useParams();

  // Render the card tap router
  // Set debugMode={true} to see card info before redirecting (useful for testing)
  // Set debugMode={false} or omit it for production (auto-redirects)
  return <CardTapRouter cardUid={cardUid as string} debugMode={true} />;
}
