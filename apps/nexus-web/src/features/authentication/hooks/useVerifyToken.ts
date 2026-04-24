import { useMutation } from "@tanstack/react-query"; 
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export const useVerifyToken = () => {
  const callEndpoint = useCallEndpointWithToken();
  return useMutation({
    mutationFn: async (
      payload: Parameters<typeof callEndpoint<typeof contract.api.v1.authentication.verify.POST>>[2]["body"]
    ) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.verify.POST,
        {
          body: payload,
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
