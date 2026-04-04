import { useMutation } from "@tanstack/react-query"; 
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useFetchApi } from "@/hooks/useFetchApi";

export const useLogin = () => {
  const callEndpoint = useFetchApi();
  return useMutation({
    mutationFn: async (payload: { email: string; pass: string }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.login.POST,
        {
          body: {
            data: {
              email: payload.email,
              pass: payload.pass,
            },
          },
        },
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
