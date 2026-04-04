import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateSparkmatesCard } from "../api/activateSparkmatesCard";
import type { SparkmatesSource } from "../types";

export function useActivateSparkmatesCard({
  cardId,
  source,
}: {
  cardId: string;
  source?: SparkmatesSource;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => activateSparkmatesCard({ cardId: cardId, token }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sparkmates-profile", cardId, source],
      });
    },
  });
}
