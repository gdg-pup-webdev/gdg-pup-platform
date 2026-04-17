import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useCreateEventFromBevyEvent = () => {
  const queryClient = useQueryClient();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: async (bevy_event_id: string) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.from_bevy_event.POST,
        {
          body: {
            bevy_event_id,
          },
        }
      );

      if (res.status === 201) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
