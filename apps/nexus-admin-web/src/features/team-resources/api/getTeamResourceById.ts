import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { extractErrorMessage } from "@/lib/utils";

const API_URL = "http://localhost:8000";

export const useGetTeamResourceById = (id: string) => {
  return useQuery({
    queryKey: ["team-resources", id],
    queryFn: async () => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.team_resources.resourceId.GET,
        {
          params: { resourceId: id },
        },
      );

      if (res.status !== 200) throw new Error(extractErrorMessage(res.body));

      return res.body;
    },
    enabled: !!id,
  });
};
