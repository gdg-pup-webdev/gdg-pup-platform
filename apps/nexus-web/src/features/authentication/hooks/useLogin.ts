import { useMutation } from "@tanstack/react-query"; 
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractAuthErrorMessage } from "@/lib/utils";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export const useLogin = () => {
  const callEndpoint = useCallEndpointWithToken();
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.login.POST,
        {
          body: {
            data: {
              email: payload.email,
              password: payload.password,
            },
          },
        },
      );

      if (res.status === 200) return res.body;

      throw new Error(extractAuthErrorMessage(res.body, "login"));
    },
  });
};
