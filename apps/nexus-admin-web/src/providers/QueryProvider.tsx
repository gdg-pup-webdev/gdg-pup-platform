"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000,       // 2 minutes before data is considered stale
            gcTime: 5 * 60 * 1000,           // 5 minutes cache retention
            refetchOnWindowFocus: false,      // Don't refetch on tab focus in CMS
            retry: 1,                         // Retry once on failure
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
