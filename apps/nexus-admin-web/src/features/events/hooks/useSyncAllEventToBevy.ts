import { configs } from "@/lib/constants/configs";
import { contract } from "@packages/nexus-api-contracts";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSyncAllEventToBevy = () => {
  const queryClient = useQueryClient();
    const callEndpoint = useCallEndpointWithToken();
  return useMutation({
    mutationFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.syncAllToBevy.POST,
        {},
      );

        if (res.status === 200) return res.body;

        throw new Error(res.body.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
