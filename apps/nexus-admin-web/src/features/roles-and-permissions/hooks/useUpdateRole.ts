import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { z } from "zod";

type RoleUpdateDTO = z.infer<typeof contract.api.v1.roles.roleId.PATCH.request.body>;

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, payload }: { roleId: string; payload: RoleUpdateDTO }) => {
      console.log("hell oworld" , {
          params: { roleId: roleId },
          body: payload,
        })
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.roles.roleId.PATCH,
        {
          params: { roleId: roleId },
          body: payload,
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
      queryClient.invalidateQueries({ queryKey: ["roles", "detail", variables.roleId] });
    },
  });
};
