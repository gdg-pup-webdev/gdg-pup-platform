import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateMemberShowcaseDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useCreateMemberShowcase() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      thumbnailFile,
    }: {
      data: CreateMemberShowcaseDTO;
      thumbnailFile: File;
    }) => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.member_showcase.POST,
        {
          body: { data },
          files: { thumbnailFile },
        },
      );

      if (result.status === 201 && result.body) {
        return result.body;
      }
      throw new Error("Failed to create member showcase");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
