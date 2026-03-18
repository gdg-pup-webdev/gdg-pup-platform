/**
 * Hook to update a team resource with TanStack Query
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeamResource } from "../api/updateTeamResource";
import { UpdateTeamResourceDTO } from "../types";

/**
 * Hook to update a team resource with TanStack Query mutation
 */
export function useUpdateTeamResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, thumbnail }: { id: string; data: UpdateTeamResourceDTO; thumbnail?: File }) =>
      updateTeamResource(id, data, thumbnail),
    onSuccess: (_, variables) => {
      // Invalidate the individual and list queries
      queryClient.invalidateQueries({ queryKey: ["team-resources", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["team-resources"] });
    },
  });
}
