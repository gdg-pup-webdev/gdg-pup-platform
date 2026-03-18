import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";

const API_URL = "http://localhost:8000";

export const useGetFiles = (pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["files", pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.files.GET, {
        query: { pageNumber, pageSize },
      });

      if (res.status === 200) return res;

      throw new Error(res.body.message);
    },
  });
};
