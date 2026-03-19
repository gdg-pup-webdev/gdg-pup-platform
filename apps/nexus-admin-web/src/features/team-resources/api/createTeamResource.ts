import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { CreateTeamResourceDTO } from "../types";
import { extractErrorMessage } from "@/lib/utils";

const API_URL = "http://localhost:8000";

export const useCreateTeamResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTeamResourceDTO & { thumbnail?: File }) => {
      const res = await callEndpoint(API_URL, contract.api.v1.team_resources.POST, {
        body: {
          data: {
            title: data.title,
            description: data.description,
            resource_link: data.resource_link,
            resource_type: data.resource_type,
            team_name: data.team_name,
          },
        },
        files: data.thumbnail ? { thumbnail: data.thumbnail } : undefined,
      });

      if (res.status !== 201) throw new Error(extractErrorMessage(res.body));

      return res.body;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-resources"] });
    },
  });
};
