import { useQuery } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";

const API_URL = "http://localhost:8000";
export const useGetFolders = (pageNumber = 1, pageSize = 100, parentId?: string | null) => {
  const callEndpoint = useFetchApi();
  return useQuery({
    queryKey: ["folders", pageNumber, pageSize, parentId],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.folders.GET, {
        query: { pageNumber, pageSize, parentId },
      });

      if (res.status === 200) return res;

      throw new Error(res.body.message);
    },
  });
};
