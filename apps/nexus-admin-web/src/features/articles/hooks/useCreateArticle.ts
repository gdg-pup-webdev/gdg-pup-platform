import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { ArticleInsert } from "../types";
import { useFetchApi } from "@/hooks/useFetchApi";

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const fetchapi = useFetchApi();

  return useMutation({
    mutationFn: async ({ data, thumbnailImage }: { data: ArticleInsert; thumbnailImage?: File }) => {
      const res = await fetchapi(
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
