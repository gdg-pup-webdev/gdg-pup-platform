import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ gdgId, roleName }: { gdgId: string; roleName: string }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.users._userId_.roles.POST,
        {
          params: { userId: gdgId },
          body: { payload: { roleName } },
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
