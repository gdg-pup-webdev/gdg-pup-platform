import { useMutation } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

export const useDeleteProfile = () => {
  const { token, logout } = useAuthContext();

  return useMutation({
    mutationFn: async (gdgId: string) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.DELETE,
        {
          token: token ?? undefined,
          params: { gdgId },
        }
      );
      if (res.status === 200) return res.body;
      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: async () => {
      await logout();
      window.location.href = "/";
    },
  });
};
