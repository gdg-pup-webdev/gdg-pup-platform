import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { z } from "zod";

type RoleUpdateDTO = z.infer<typeof contract.api.v1.roles._roleName_.PATCH.body.payload>;

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleName, payload }: { roleName: string; payload: RoleUpdateDTO }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.roles._roleName_.PATCH,
        {
          params: { roleName },
          body: { payload },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
      queryClient.invalidateQueries({ queryKey: ["roles", "detail", variables.roleName] });
    },
  });
};
