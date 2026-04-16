import { useQuery } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useSuggestedMembers = (
  gdgId: string,
  pageNumber = 1,
  pageSize = 10,
) => {
  return useQuery({
    queryKey: ["members", "list", pageNumber, pageSize, gdgId],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.suggested_users.GET,
        {
          params: { gdgId },
          query: { pageNumber, pageSize },
        },
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
