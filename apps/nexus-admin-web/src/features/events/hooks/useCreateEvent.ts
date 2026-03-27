import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { EventInsert } from "../types";

type CreateEventInput = {
  title: string;
  description: string;
  category: string;
  venue: string;
  start_date: string;
  end_date: string;
  attendance_points: number;
  image_url: string | null;
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EventInsert) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.POST,
        {
          body: {
            data: {
              ...input, 
              bevy_event_id: null, // Ensure bevy_event_id is set to null for manual event creation
            },
           
          }, files: {
              thumbnail: input.image
            }
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
