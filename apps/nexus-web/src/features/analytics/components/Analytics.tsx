"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import {
  useRecordNfcScan,
  useRecordProfileView,
} from "../hooks/useRecordAnalytics";
import { STATUS, useAuthContext } from "@/features/authentication/store/useAuthStore";
 
const pathMatch = (pattern: string, pathname: string) => {
  // Split paths to handle pattern matching
  const segments = pathname.split("/").filter(Boolean);
  const configSegments = pattern.split("/").filter(Boolean);

  // Simple pattern matching: check if lengths match and non-parameter segments match
  let isMatch = segments.length === configSegments.length;

  if (isMatch) {
    for (let i = 0; i < configSegments.length; i++) {
      if (
        !configSegments[i].startsWith(":") &&
        configSegments[i] !== segments[i]
      ) {
        isMatch = false;
        break;
      }
    }
  }

  return isMatch;
};

/**
 * Inner component that uses searchParams.
 * Must be wrapped in Suspense.
 */
const Analyticss = ( ) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);
  const params = useParams();

  const auth = useAuthContext();
  const viewerGdgId = auth.decodedToken?.memberInfo.gdgId || null;

  const { mutate: recordNfcScan } = useRecordNfcScan();
  const { mutate: recordProfileView } = useRecordProfileView();

  useEffect(() => {
    if (!pathname) return;
    if (auth.status === STATUS.CHECKING) return;

    console.log("pathname changed:", pathname, searchParams.toString() || null, viewerGdgId, lastTracked.current);

    // Create a unique key for the current view to avoid duplicate tracking
    const currentViewKey = `${pathname}?${searchParams.toString()}`;
    if (lastTracked.current === currentViewKey) return;

    if (pathMatch("/sparkmates/:gdgId", pathname)) {
      const profileGdgId = params.gdgId;

      if (!profileGdgId || profileGdgId === "me") {
        // Viewing own profile - do not track
        lastTracked.current = currentViewKey;
        return;
      }

      if (profileGdgId === viewerGdgId) {
        // Viewing own profile via gdgId - do not track
        lastTracked.current = currentViewKey;
        return;
      }

      const source = searchParams.get("source") || "direct";

      recordProfileView({
        profileGdgId: profileGdgId as string,
        source: source as string,
        user_agent: window.navigator.userAgent,
        viewerGdgId: viewerGdgId,
      });

      if (source === "nfc-card") {
        const scanContext = searchParams.get("scanContext") || null;
        const scannerId = searchParams.get("scannerId") || null;

        recordNfcScan({
          ownerGdgId: profileGdgId as string,
          scanContext: scanContext || null,
          scannerId: scannerId || viewerGdgId,
        });
      }

    }
    
      lastTracked.current = currentViewKey;
  }, [
    pathname,
    searchParams, 
    recordNfcScan,
    recordProfileView,
    viewerGdgId,
    auth.status
  ]);

  return null;
};

/**
 * A central component to track analytics based on route changes.
 * This should be placed at the root layout of the application.
 * Wrapped in Suspense to prevent CSR bailout during build.
 */
export const Analytics = ( ) => {
  return (
    <Suspense fallback={null}>
      <Analyticss   />
    </Suspense>
  );
};
