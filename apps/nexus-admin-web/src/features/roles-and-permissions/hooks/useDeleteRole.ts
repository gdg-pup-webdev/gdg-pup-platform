import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
export const useDeleteRole = () => {
  const callEndpoint = useFetchApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roleId: string) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.roles.roleId.DELETE,
        {
          params: { roleId: roleId },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
    },
  });
};
