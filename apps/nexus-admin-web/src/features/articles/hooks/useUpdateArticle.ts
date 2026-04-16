import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { ArticleUpdate } from "../types";

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, thumbnailImage }: { id: string; data: ArticleUpdate; thumbnailImage?: File }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.articles.id.PATCH,
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
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles", "detail", variables.id] });
    },
  });
};
