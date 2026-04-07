"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { useRecordNfcScan, useRecordProfileView } from "../hooks/useRecordAnalytics";
import { STATUS, useAuthContext } from "@/features/authentication/store/useAuthStore";

/**
 * Configuration for analytics tracking.
 */
export type AnalyticsConfig = {
  /**
   * Path pattern to match (e.g., "/profile/:gdgId")
   * Supports :param segments.
   */
  path: string;
  /**
   * Type of analytics to trigger.
   */
  trigger: "profile-view" | "nfc-scan";
  /**
   * Mapping of analytics parameters to their source in the route.
   * Format: "params.name" for path segments, "queries.name" for query parameters.
   * Example: { profileGdgId: "params.gdgId", source: "queries.source" }
   */
  params: Record<string, string>;
};

interface AnalyticsTrackerProps {
  configs: AnalyticsConfig[];
}

/**
 * Inner component that uses searchParams.
 * Must be wrapped in Suspense.
 */
const AnalyticsTrackerContent = ({ configs: trackingConfigs }: AnalyticsTrackerProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);
  
  const auth = useAuthContext();
  const viewerGdgId = auth.decodedToken?.memberInfo.gdgId || null;

  const { mutate: recordNfcScan } = useRecordNfcScan();
  const { mutate: recordProfileView } = useRecordProfileView();

  console.log("AnalyticsTracker: Pathname changed to", pathname);
  console.log("AnalyticsTracker: Search params changed to", searchParams);
  console.log("viewerGdgId:", viewerGdgId);


  useEffect(() => {
    if (auth.status === STATUS.CHECKING) return;

    if (!pathname) return;

    // Create a unique key for the current view to avoid duplicate tracking
    const currentViewKey = `${pathname}?${searchParams.toString()}`;
    if (lastTracked.current === currentViewKey) return;

    for (const config of trackingConfigs) {
      // Split paths to handle pattern matching
      const segments = pathname.split("/").filter(Boolean);
      const configSegments = config.path.split("/").filter(Boolean);
      
      // Simple pattern matching: check if lengths match and non-parameter segments match
      let isMatch = segments.length === configSegments.length;
      
      if (isMatch) {
        for (let i = 0; i < configSegments.length; i++) {
          if (!configSegments[i].startsWith(":") && configSegments[i] !== segments[i]) {
            isMatch = false;
            break;
          }
        }
      }

      // Fallback: if lengths don't match, check if config.path is a prefix (for deep nested routes)
      // but only if it doesn't contain parameters.
      if (!isMatch && !config.path.includes(":") && pathname.startsWith(config.path)) {
        isMatch = true;
      }

      if (isMatch) {
        // Extract values based on mapping
        const extractedValues: Record<string, string | null> = {};
        
        Object.entries(config.params).forEach(([key, mapping]) => {
          const [source, name] = mapping.split(".");
          let value: string | null = null;
          
          if (source === "params") {
            // Find index of name in configSegments (as :name)
            const paramIndex = configSegments.findIndex(s => s === `:${name}`);
            if (paramIndex !== -1) {
              value = segments[paramIndex];
            } else {
              // Fallback: if param not in pattern, maybe it was meant to be the last segment
              value = segments[segments.length - 1];
            }
          } else if (source === "queries") {
            value = searchParams.get(name);
          }

          // Resolve virtual "me" ID to the actual authenticated user ID
          if (value === "me") {
            value = viewerGdgId;
          }

          extractedValues[key] = value;
        });

        if (config.trigger === "profile-view") {
          const profileGdgId = extractedValues.profileGdgId;
          
          // Only record if we have a valid profile ID (not "me" if unauthenticated)
          if (profileGdgId && profileGdgId !== "me") {

            console.log("Recording profile view with values:", {
              profileGdgId,
              source: extractedValues.source || "direct",
              user_agent: window.navigator.userAgent,
              viewerGdgId,
            });
            recordProfileView({
              profileGdgId: profileGdgId,
              source: extractedValues.source || "direct",
              user_agent: window.navigator.userAgent,
              viewerGdgId: viewerGdgId,
            });
          }
        } else if (config.trigger === "nfc-scan") {
          const nfcCardId = extractedValues.nfcCardId;
          
          if (nfcCardId) {
            recordNfcScan({
              nfcCardId: nfcCardId,
              scanContext: extractedValues.scanContext || null,
              scannerId: extractedValues.scannerId || viewerGdgId,
            });
          }
        }

        lastTracked.current = currentViewKey;
        break; // Only trigger one analytic per route change
      }
    }
  }, [pathname, searchParams, trackingConfigs, recordNfcScan, recordProfileView, viewerGdgId, auth.status]);

  return null;
};

/**
 * A central component to track analytics based on route changes.
 * This should be placed at the root layout of the application.
 * Wrapped in Suspense to prevent CSR bailout during build.
 */
export const AnalyticsTracker = (props: AnalyticsTrackerProps) => {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent {...props} />
    </Suspense>
  );
};
