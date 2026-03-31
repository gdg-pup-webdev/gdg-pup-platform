import { useMutation } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/features/authentication/store/useAuthStore";

export const useChangeEmailInitiate = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: async (
      payload: Parameters<typeof callEndpoint<typeof contract.api.v1.authentication.email.change.initiate.POST>>[2]["body"]
    ) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.email.change.initiate.POST,
        {
          body: payload,
          token: token ?? undefined,
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
