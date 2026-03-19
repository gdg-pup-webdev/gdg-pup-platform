/**
 * Hook to create a team resource with TanStack Query
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeamResource } from "../api/createTeamResource";
import { CreateTeamResourceDTO } from "../types";

/**
 * Hook to create a team resource with TanStack Query mutation
 * 
 * Provides state management and helper functions for creating
 * a new team resource.
 * 
 * @returns Mutation result with create function and loading state
 */
export function useCreateTeamResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, thumbnail }: { data: CreateTeamResourceDTO; thumbnail?: File }) =>
      createTeamResource(data, thumbnail),
    onSuccess: () => {
      // Invalidate the team resources list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["team-resources"] });
    },
  });
}
