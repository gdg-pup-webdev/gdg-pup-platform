import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { UpdateTeamResourceDTO } from "../types";
import { extractErrorMessage } from "@/lib/utils";

const API_URL = "http://localhost:8000";

export const useUpdateTeamResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, thumbnail }: { id: string; data: UpdateTeamResourceDTO; thumbnail?: File }) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.team_resources.resourceId.PATCH,
        {
          params: { resourceId: id },
          body: {
            data: {
              title: data.title,
              description: data.description,
              resource_link: data.resource_link,
              resource_type: data.resource_type,
              team_name: data.team_name,
            },
          },
          files: thumbnail ? { thumbnail } : undefined,
        },
      );

      if (res.status !== 200) throw new Error(extractErrorMessage(res.body));

      return res.body;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team-resources"] });
      queryClient.invalidateQueries({ queryKey: ["team-resources", variables.id] });
    },
  });
};
