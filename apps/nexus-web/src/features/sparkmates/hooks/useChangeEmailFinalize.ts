import { useMutation } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useChangeEmailFinalize = () => {
  return useMutation({
    mutationFn: async (
      payload: Parameters<typeof callEndpoint<typeof contract.api.v1.authentication.email.change.finalize.POST>>[2]["body"]
    ) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.email.change.finalize.POST,
        {
          body: payload,
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
