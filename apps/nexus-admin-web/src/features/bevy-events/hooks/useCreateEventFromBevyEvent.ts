import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

export const useCreateEventFromBevyEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bevyEventId: string) => {
      const res = await callEndpoint(configs.nexusApiBaseUrl, contract.api.v1.eventSystem.event.from_bevy_event.POST, {
        body: { bevy_event_id: bevyEventId },
      });

      if (res.status === 201) return res.body;

      throw new Error(res.body.message);
    },
    onSuccess: () => {
      // Invalidate events list if we had one, but here we probably want to invalidate nexus-api events
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
