import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

type CheckinInput = {
  eventId: string;
  attendeeId: string;
  checkinMethod: "QR_CODE" | "MANUAL" | "GOOGLE_FORMS" | "NFC";
};
export const useCheckinToEvent = () => {
  const callEndpoint = useFetchApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, attendeeId, checkinMethod }: CheckinInput) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.attendees.POST,
        {
          params: { eventId },
          body: {
            data: {
              attendeeId,
              checkinMethod,
            },
          },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events", "attendees", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
  });
};
