import { useQuery } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useGetRoleById = (roleId: string) => {
  return useQuery({
    queryKey: ["roles", "detail", roleId],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.roles.roleId.GET,
        {
          params: { roleId },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    enabled: !!roleId,
  });
};
