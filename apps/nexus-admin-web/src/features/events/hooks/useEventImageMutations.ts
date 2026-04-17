import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { Event } from "../types";

type EventImageBaseInput = {
  eventId: string;
};

type AddEventImageInput = EventImageBaseInput & {
  image: File;
};

type DeleteEventImageInput = EventImageBaseInput & {
  imageIndex: number;
};

type ReorderEventImagesInput = EventImageBaseInput & {
  fromIndex: number;
  toIndex: number;
};

function useInvalidateEventQueries() { 
  const queryClient = useQueryClient();

  return (eventId: string) => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
  };
}

export const useAddEventImage = () => {
  const invalidateEventQueries = useInvalidateEventQueries();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: async ({ eventId, image }: AddEventImageInput) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.images.POST,
        {
          params: { eventId },
          body: {},
          files: { image },
        },
      );

      if (res.status === 200 && res.body) {
        return res.body.data as Event;
      }

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, { eventId }) => {
      invalidateEventQueries(eventId);
    },
  });
};

export const useDeleteEventImage = () => {
  const invalidateEventQueries = useInvalidateEventQueries();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: async ({ eventId, imageIndex }: DeleteEventImageInput) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.images.imageIndex.DELETE,
        {
          params: {
            eventId,
            imageIndex: String(imageIndex),
          },
        },
      );

      if (res.status === 200 && res.body) {
        return res.body.data as Event;
      }

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, { eventId }) => {
      invalidateEventQueries(eventId);
    },
  });
};

export const useReorderEventImages = () => {
  const invalidateEventQueries = useInvalidateEventQueries();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: async ({
      eventId,
      fromIndex,
      toIndex,
    }: ReorderEventImagesInput) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.images.reorder.PATCH,
        {
          params: { eventId },
          body: {
            data: {
              fromIndex,
              toIndex,
            },
          },
        },
      );

      if (res.status === 200 && res.body) {
        return res.body.data as Event;
      }

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, { eventId }) => {
      invalidateEventQueries(eventId);
    },
  });
};
