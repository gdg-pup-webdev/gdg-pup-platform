import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import type { SparkmatesSource } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useActivateSparkmatesCard({
  cardId,
  source,
}: {
  cardId: string;
  source?: SparkmatesSource;
}) {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.nfc_cards.cardId.activate.POST,
        {
          params: { cardId },
          token,
        },
      );

      if (result.status === 200) {
        return result.body;
      }

      const message =
        result.body &&
        typeof result.body === "object" &&
        "message" in result.body
          ? String(
              (result.body as { message?: unknown }).message ??
                "Failed to activate Sparkmates card",
            )
          : "Failed to activate Sparkmates card";

      throw new Error(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sparkmates-profile", cardId, source],
      });
    },
  });
}
