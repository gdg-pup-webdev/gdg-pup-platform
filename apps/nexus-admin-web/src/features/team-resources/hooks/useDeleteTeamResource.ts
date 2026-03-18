/**
 * Hook to delete a team resource with TanStack Query
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeamResource } from "../api/deleteTeamResource";

/**
 * Hook to delete a team resource with TanStack Query mutation
 */
export function useDeleteTeamResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTeamResource(id),
    onSuccess: () => {
      // Invalidate the team resources list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["team-resources"] });
    },
  });
}
