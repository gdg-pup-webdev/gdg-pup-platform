import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { z } from "zod";

type RoleInsertDTO = z.infer<typeof contract.api.v1.roles.POST.request.body>;
export const useCreateRole = () => {
  const callEndpoint = useFetchApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RoleInsertDTO) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.roles.POST,
        {
          body: payload,
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
