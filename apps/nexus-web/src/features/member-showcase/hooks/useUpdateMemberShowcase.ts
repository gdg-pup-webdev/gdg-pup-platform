import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { UpdateMemberShowcaseDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useUpdateMemberShowcase() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      thumbnailFile,
    }: {
      id: string;
      data: UpdateMemberShowcaseDTO;
      thumbnailFile?: File;
    }) => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.member_showcase.id.PATCH,
        {
          params: { id },
          body: { data },
          files: { thumbnailFile },
        },
      );

      if (result.status === 200 && result.body) {
        return result.body;
      }
      throw new Error("Failed to update member showcase");
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
      queryClient.invalidateQueries({ queryKey: ["member-showcase", id] });
    },
  });
}
