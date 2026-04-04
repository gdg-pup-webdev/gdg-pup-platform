import { useQuery } from "@tanstack/react-query"; 
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useFetchApi } from "@/hooks/useFetchApi";

export const useGetOneArticle = (id: string) => {
  const callEndpoint = useFetchApi();
  return useQuery({
    queryKey: ["articles", "detail", id],
    queryFn: async () => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.articles.id.GET,
        {
          params: { id },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    enabled: !!id,
  });
};
