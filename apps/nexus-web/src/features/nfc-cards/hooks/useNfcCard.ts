import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken as callEndpoint, useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

export const useNfcCard = (gdgId: string) => {
  const { token } = useAuthContext();
  const callEndpoint = useCallEndpointWithToken();

  return useQuery({
    queryKey: ["nfc-card", gdgId],
    queryFn: async () => {
      console.log("Fetching NFC card with ID:", gdgId);
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.nfc_card.GET,
        {
          params: {
            gdgId: gdgId,
          },
          token: token ?? undefined,
        },
      );

      console.log("Fetched NFC card with ID:", gdgId);

      if (res.status === 200) return res.body.data;

      if (res.status === 404) return null;

      throw new Error(extractErrorMessage(res.body));
    }, 
  });
};
