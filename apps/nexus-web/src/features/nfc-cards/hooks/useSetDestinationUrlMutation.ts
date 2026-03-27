import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { contract } from "@packages/nexus-api-contracts";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetDestinationUrlMutation() {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();
  return useMutation({
    mutationFn: async (props: { cardId: string; destinationUrl: string }) => {
      if (!token) throw new Error("User is not authenticated");

      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.nfc_cards.cardId.destination_url.POST,
        {
          params: {
            cardId: props.cardId,
          },
          body: {
            data: {
              destinationUrl: props.destinationUrl,
            },
          },
          token: token,
        },
      );

      if (res.status === 200) return res.body.data;

      throw new Error(extractErrorMessage(res.body));
    },

    onSuccess: (a) => {
      queryClient.invalidateQueries({
        queryKey: ["nfc-card", "owner", a.ownerGdgId],
      });
    },
  });
}
