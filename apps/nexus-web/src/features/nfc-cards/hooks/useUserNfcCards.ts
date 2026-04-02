import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

export const useUserNfcCards = (ownerGdgId?: string) => {
  const { token } = useAuthContext();

  return useQuery({
    queryKey: ["nfc-card", "owner", ownerGdgId],
    queryFn: async () => { 
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.nfc_cards.GET,
        {
          query: {
            gdgId: ownerGdgId!,
          },
          token: token ?? undefined,
        },
      );
 

      if (res.status === 200) return res.body.data;

      throw new Error(extractErrorMessage(res.body));
    }, 
    enabled: !!ownerGdgId
  });
};
