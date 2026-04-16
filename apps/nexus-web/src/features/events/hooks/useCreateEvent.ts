import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken   } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { EventInsert } from "../types";

export const useCreateEvent = () => {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EventInsert) => {
      const { image, ...eventData } = input;
      
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.POST,
        {
          body: {
            data: {
              ...eventData,
              creatorId: "00000000-0000-0000-0000-000000000000", // Placeholder, server-side will handle
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
