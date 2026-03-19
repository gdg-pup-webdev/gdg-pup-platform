import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { EventHighlightUpdate } from "../types";

export const useUpdateHighlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, thumbnailImage }: { id: string; data: EventHighlightUpdate; thumbnailImage?: File }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.event_highlights.id.PATCH,
        {
          params: { id },
          body: { data },
          files: {
            thumbnail_image: thumbnailImage,
          },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["event-highlights"] });
      queryClient.invalidateQueries({ queryKey: ["event-highlights", "detail", variables.id] });
    },
  });
};
