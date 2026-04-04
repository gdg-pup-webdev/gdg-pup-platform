import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useFetchApi } from "@/hooks/useFetchApi";

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
    const fetchapi = useFetchApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchapi(
        configs.nexusApiBaseUrl,
        contract.api.v1.articles.id.DELETE,
        {
          params: { id },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};
