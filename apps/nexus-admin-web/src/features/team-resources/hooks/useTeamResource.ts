/**
 * Hook to fetch a single team resource with TanStack Query
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getTeamResourceById } from "../api/getTeamResourceById";

/**
 * Hook to fetch a single team resource by ID with TanStack Query
 * 
 * @param id - The ID of the team resource
 * @returns Query result with team resource data
 */
export function useTeamResource(id: string) {
  return useQuery({
    queryKey: ["team-resources", id],
    queryFn: () => getTeamResourceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
