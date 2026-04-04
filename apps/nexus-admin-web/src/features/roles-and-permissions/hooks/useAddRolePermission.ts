import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { z } from "zod";

type RolePermissionInsertDTO = z.infer<typeof contract.api.v1.roles.roleId.permissions.POST.request.body>;

export const useAddRolePermission = (roleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RolePermissionInsertDTO) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.roles.roleId.permissions.POST,
        {
          params: { roleId: roleId },
          body: payload,
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "detail", roleId] });
    },
  });
};
