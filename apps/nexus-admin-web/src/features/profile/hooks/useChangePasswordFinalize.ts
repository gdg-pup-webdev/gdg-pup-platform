import { useMutation } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
export const useChangePasswordFinalize = () => {
  const callEndpoint = useFetchApi();
  return useMutation({
    mutationFn: async (
      payload: Parameters<typeof callEndpoint<typeof contract.api.v1.authentication.password.change.finalize.POST>>[2]["body"]
    ) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.password.change.finalize.POST,
        {
          body: payload,
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
