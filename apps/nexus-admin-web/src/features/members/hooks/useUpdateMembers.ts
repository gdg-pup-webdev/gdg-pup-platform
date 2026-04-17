import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

import { GdgMemberUpdate } from "../types";

type UpdateMemberInput = {
  gdgId: string;
  data: GdgMemberUpdate;
  profileImage?: File | null;
};

export const useUpdateMember = () => {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gdgId, data, profileImage }: UpdateMemberInput) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.gdgId.PATCH,
        {
          params: { gdgId: gdgId },
          body: { data },
          // files: { profile_image: profileImage || undefined },
        },
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, { gdgId }) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", "get", gdgId] });
    },
  });
};
