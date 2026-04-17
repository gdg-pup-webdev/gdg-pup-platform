import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken as callEndpoint, useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { toast } from "react-toastify";

export const useToggleNfcVisibility = (gdgId: string) => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: async (makePublic: boolean) => {
      if (makePublic) {
        const res = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.gdgmembers.gdgId.make_public.POST,
          {
            token: token ?? undefined,
            params: { gdgId },
          }
        );
        if (res.status === 200) return res.body;
        throw new Error(extractErrorMessage(res.body));
      } else {
        const res = await callEndpoint(
          configs.nexusApiBaseUrl,
          contract.api.v1.gdgmembers.gdgId.make_private.POST,
          {
            token: token ?? undefined,
            params: { gdgId },
          }
        );
        if (res.status === 200) return res.body;
        throw new Error(extractErrorMessage(res.body));
      }
    },
    onSuccess: (_data, makePublic) => {
      queryClient.invalidateQueries({ queryKey: ["sparkmates", "profile", gdgId] });
      toast.success(
        makePublic
          ? "NFC card is now public."
          : "NFC card is now private."
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update NFC visibility.");
    },
  });
};
