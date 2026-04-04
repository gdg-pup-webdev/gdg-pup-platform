import { configs } from "@/lib/constants/configs";
import { contract } from "@packages/nexus-api-contracts";
import { useFetchApi } from "@/hooks/useFetchApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useSyncOneEventToBevy = () => {
  const callEndpoint = useFetchApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { eventId: string }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.syncToBevy.POST,
        {
          params: {
            eventId: params.eventId,
          },
        },
      );

      if (res.status === 200) return res.body;

      throw new Error(res.body.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
