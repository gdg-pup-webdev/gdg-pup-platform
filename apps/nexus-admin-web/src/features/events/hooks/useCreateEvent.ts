import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { EventInsert } from "../types";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EventInsert) => {
      // Create a temporary object for the data to ensure we match the contract
      const { image, ...eventData } = input;
      
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.POST,
        {
          body: {
            data: {
              ...eventData,
              bevy_event_id: null,
              tags: [],
              short_description: null,
              bevyPreviewUrl: null,
              max_capacity: 999999,
              creatorId: "00000000-0000-0000-0000-000000000000", // This will be overridden by the backend controller from auth
            },
          },
          files: {
            thumbnail: image,
          },
        },
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};