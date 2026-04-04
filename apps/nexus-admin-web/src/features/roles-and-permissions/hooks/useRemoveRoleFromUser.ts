import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
export const useRemoveRoleFromUser = () => {
  const callEndpoint = useFetchApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ gdgId, roleName }: { gdgId: string; roleName: string }) => {
      
      // throw new Error("This endpoint has not been implemented yet.");
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.roles.roleName.DELETE,
        {
          params: { gdgId: gdgId, roleName },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", "roles", variables.gdgId] });
    },
  });
};
