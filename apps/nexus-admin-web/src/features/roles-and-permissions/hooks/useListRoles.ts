import { useQuery } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useListRoles = (params: { pageNumber?: number; pageSize?: number; userId?: string; resourceName?: string; actionName?: string } = {}) => {
  const { pageNumber = 1, pageSize = 10, ...rest } = params;
  return useQuery({
    queryKey: ["roles", "list", pageNumber, pageSize, rest],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.roles.GET,
        {
          query: { pageNumber, pageSize, ...rest },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
