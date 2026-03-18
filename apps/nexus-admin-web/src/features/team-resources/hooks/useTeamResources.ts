/**
 * Hook to fetch team resources with TanStack Query
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getTeamResources } from "../api/getTeamResources";
import { TeamResourcesQueryParams } from "../types";

/**
 * Hook to fetch team resources with TanStack Query
 * 
 * Provides automatic caching, background refetching, and state management
 * for team resources data.
 * 
 * @param params - Query parameters for filtering team resources
 * @returns Query result with team resources data, loading state, and error
 */
export function useTeamResources(params: TeamResourcesQueryParams = {}) {
  return useQuery({
    queryKey: ["team-resources", params],
    queryFn: () => getTeamResources(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}
