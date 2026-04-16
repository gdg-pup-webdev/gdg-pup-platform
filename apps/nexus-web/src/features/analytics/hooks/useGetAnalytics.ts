import { useQuery } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/configs/servers.config";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Hook to get NFC scan analytics for a specific card.
 */
export const useGetNfcAnalytics = (cardId: string, pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["analytics", "nfc-scans", cardId, pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.analytics.nfc_scans.cardId.GET,
        {
          params: { cardId },
          query: { pageNumber, pageSize },
        },
      );

      if (res.status !== 200) {
        throw new Error(extractErrorMessage(res.body));
      }

      return res.body.data;
    },
    enabled: !!cardId,
  });
};

/**
 * Hook to get profile view analytics for a specific member.
 */
export const useGetProfileAnalytics = (gdgId: string, pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["analytics", "profile-views", gdgId, pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.analytics.profile_views.gdgId.GET,
        {
          params: { gdgId },
          query: { pageNumber, pageSize },
        },
      );

      if (res.status !== 200) {
        throw new Error(extractErrorMessage(res.body));
      }

      return res.body.data;
    },
    enabled: !!gdgId,
  });
};
