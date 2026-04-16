import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { contract } from "@packages/nexus-api-contracts";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { useMutation } from "@tanstack/react-query";

export function useCardActivation() {
  const {token} = useAuthContext();
  return useMutation({
    mutationFn: async (cardId: string) => {
      if (!token) throw new Error("User is not authenticated");

      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.nfc_cards.cardId.activate.POST,
        {
          params: {
            cardId: cardId,
          },
          token: token 
        },
      );

      if (res.status === 200) return res.body.data;

      throw new Error(extractErrorMessage(res.body));
    }, 
  });
}
