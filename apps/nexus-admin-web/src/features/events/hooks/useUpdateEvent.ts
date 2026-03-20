import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

type UpdateEventInput = {
  eventId: string;
  data: {
    title?: string;
    description?: string;
    category?: string;
    venue?: string;
    start_date?: string;
    end_date?: string;
    attendance_points?: number;
    image_url?: string | null;
  };
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, data }: UpdateEventInput) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.PATCH,
        {
          params: { eventId },
          body: { data },
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
