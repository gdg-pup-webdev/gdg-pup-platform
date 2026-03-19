import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { extractErrorMessage } from "@/lib/utils";

const API_URL = "http://localhost:8000";

export const useGetTeamResources = (pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["team-resources", pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.team_resources.GET, {
        query: { pageNumber, pageSize },
      });

      if (res.status !== 200) throw new Error(extractErrorMessage(res.body));

      return res.body;
    },
  });
};

export const useSearchTeamResources = (query: string) => {
  return useQuery({
    queryKey: ["team-resources", "search", query],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.team_resources.search.GET, {
        query: { q: query },
      });

      if (res.status !== 200) throw new Error(extractErrorMessage(res.body));

      return res.body;
    },
    enabled: !!query && query.length >= 2,
  });
};
