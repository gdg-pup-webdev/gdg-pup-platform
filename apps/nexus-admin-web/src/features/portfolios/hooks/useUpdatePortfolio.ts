import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

import { PortfolioUpdate } from "../types";

type UpdatePortfolioInput = {
  portfolioId: string;
  data: PortfolioUpdate;
  profileImage?: File | null;
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ portfolioId, data, profileImage }: UpdatePortfolioInput) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.portfolios.portfolioId.PATCH,
        {
          params: { portfolioId },
          body: { data },
          files: { profile_image: profileImage || undefined },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
    onSuccess: (_, { portfolioId }) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["portfolios", "get", portfolioId] });
    },
  });
};
