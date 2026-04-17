import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import { contract } from "@packages/nexus-api-contracts";

export function useDeleteMemberShowcase() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.member_showcase.id.DELETE,
        {
          params: { id },
        },
      );

      if (result.status === 200) {
        return true;
      }
      throw new Error("Failed to delete member showcase");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
