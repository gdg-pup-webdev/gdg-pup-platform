import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useSyncBevyEvents = () => {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdg_scraped_events.sync.POST,
        {}
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bevy-events"] });
    },
  });
};
