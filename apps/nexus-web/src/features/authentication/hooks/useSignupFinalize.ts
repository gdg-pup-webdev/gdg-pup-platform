import { useMutation } from "@tanstack/react-query"; 
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractAuthErrorMessage } from "@/lib/utils";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export const useSignupFinalize = () => {
  const callEndpoint = useCallEndpointWithToken();
  return useMutation({
    mutationFn: async (
      payload: Parameters<typeof callEndpoint<typeof contract.api.v1.authentication.signup.finalize.POST>>[2]["body"]
    ) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.signup.finalize.POST,
        {
          body: payload,
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractAuthErrorMessage(res.body, "signup-finalize"));
    },
  });
};
