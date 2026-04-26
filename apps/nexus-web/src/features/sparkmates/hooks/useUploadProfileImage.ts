import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken as callEndpoint, useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { toast } from "react-toastify";

export const useUploadProfileImage = (gdgId: string) => {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: async (file: File) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.profile_image.POST,
        {
          token: token ?? undefined,
          params: { gdgId },
          files: { newProfile: file },
          body: { data: {} },
        }
      );

      if (res.status === 200) return res.body;
      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sparkmates", "profile", gdgId] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      toast.success("Profile picture updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to upload profile image.");
    },
  });
};
