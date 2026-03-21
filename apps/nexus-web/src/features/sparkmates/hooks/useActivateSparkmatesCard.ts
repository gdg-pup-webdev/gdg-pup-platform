import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateSparkmatesCard } from "../api/activateSparkmatesCard";
import type { SparkmatesSource } from "../types";

export function useActivateSparkmatesCard({
  gdgId,
  source,
}: {
  gdgId: string;
  source?: SparkmatesSource;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => activateSparkmatesCard({ gdgId, token }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sparkmates-profile", gdgId, source],
      });
    },
  });
}
