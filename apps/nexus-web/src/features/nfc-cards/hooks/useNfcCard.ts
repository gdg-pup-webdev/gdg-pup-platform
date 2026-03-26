import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

export const useNfcCard = (cardId: string) => {
  const { token } = useAuthContext();

  return useQuery({
    queryKey: ["nfc-card", cardId],
    queryFn: async () => {
      console.log("Fetching NFC card with ID:", cardId);
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.nfc_cards.cardId.GET,
        {
          params: {
            cardId: cardId,
          },
          token: token ?? undefined,
        },
      );

      console.log("Fetched NFC card with ID:", cardId);

      if (res.status === 200) return res.body.data;

      throw new Error(extractErrorMessage(res.body));
    }, 
  });
};
