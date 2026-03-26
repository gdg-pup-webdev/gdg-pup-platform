import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useGetMemberRoles = (gdgId: string) => {
  return useQuery({
    queryKey: ["members", "roles", gdgId],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.users._userId_.roles.GET,
        {
          params: { userId: gdgId },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    enabled: !!gdgId,
  });
};
