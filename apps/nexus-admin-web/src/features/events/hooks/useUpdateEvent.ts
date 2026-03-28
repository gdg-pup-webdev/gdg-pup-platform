import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { EventUpdate } from "../types";

type UpdateEventInput = {
  eventId: string;
  data: EventUpdate;
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, data }: UpdateEventInput) => {
      // Remove image from data as it's handled separately if needed
      // Note: The current contract/controller for PATCH /v1/events/:id doesn't seem to support file upload yet
      // If it did, it would be in the 'files' property of callEndpoint
      const { image, ...updateData } = data;

      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.PATCH,
        {
          params: { eventId },
          body: { data: updateData as any },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
  });
};
