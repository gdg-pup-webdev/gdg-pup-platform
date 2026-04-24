import { useMutation } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (payload: { token: string }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.authentication.refresh.POST,
        {
          body: {
            data: {
              token: payload.token,
            },
          },
        },
      );

      if (res.status === 200) return res.body;

      // Handle session expiration specifically
      const errorMessage = extractErrorMessage(res.body);
      if (res.status === 401 || errorMessage.includes("Session expired")) {
        const error = new Error(errorMessage || "Session expired");
        (error as any).isSessionExpired = true;
        throw error;
      }

      throw new Error(errorMessage);
    },
  });
};

