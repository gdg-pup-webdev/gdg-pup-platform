import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { extractErrorMessage } from "@/lib/utils";

const API_URL = "http://localhost:8000";

export const useDeleteTeamResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.team_resources.resourceId.DELETE,
        {
          params: { resourceId: id },
        },
      );

      if (res.status !== 200) throw new Error(extractErrorMessage(res.body));

      return res.body;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-resources"] });
    },
  });
};
