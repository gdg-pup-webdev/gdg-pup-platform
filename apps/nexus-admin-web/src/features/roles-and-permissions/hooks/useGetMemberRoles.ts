import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useGetMemberRoles = (gdgId: string) => {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["members", "roles", gdgId],
    queryFn: async () : Promise<{ roles: string[] }> => {
      // throw new Error("This endpoint has not been implemented yet.");
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.roles.GET,
        {
          params: { gdgId: gdgId },
          query : { pageNumber: 1, pageSize: 100 }, // Assuming a user won't have more than 100 roles. Adjust as needed.
        }
      );
// 
      if (res.status === 200) {
        return { roles: res.body.data.map((role: { name: string }) => role.name) };
      }
// 
      throw new Error(extractErrorMessage(res.body));
    },
    enabled: !!gdgId,
  });
};
