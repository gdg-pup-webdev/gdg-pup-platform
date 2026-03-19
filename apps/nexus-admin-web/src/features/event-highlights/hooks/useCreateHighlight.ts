import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { EventHighlightInsert } from "../types";

export const useCreateHighlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, thumbnailImage }: { data: EventHighlightInsert; thumbnailImage?: File }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.event_highlights.POST,
        {
          body: { data },
          files: {
            thumbnail_image: thumbnailImage,
          },
        }
      );

      if (res.status === 201) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-highlights"] });
    },
  });
};
