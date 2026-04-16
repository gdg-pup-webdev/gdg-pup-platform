import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { ArticleInsert } from "../types";

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, thumbnailImage }: { data: ArticleInsert; thumbnailImage?: File }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.articles.POST,
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
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};
