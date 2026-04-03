import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useGetMemberRoles = (gdgId: string) => {
  return useQuery({
    queryKey: ["members", "roles", gdgId],
    queryFn: async () : Promise<{ roles: string[] }> => {
      throw new Error("This endpoint has not been implemented yet.");
      // const res = await callEndpoint(
      //   configs.nexusApiBaseUrl,
      //   contract.api.v1.users.userId.roles.GET,
      //   {
      //     params: { userId: gdgId },
      //   }
      // );

      // if (res.status === 200) return res.body;

      // throw new Error(extractErrorMessage(res.body));
    },
    enabled: !!gdgId,
  });
};
