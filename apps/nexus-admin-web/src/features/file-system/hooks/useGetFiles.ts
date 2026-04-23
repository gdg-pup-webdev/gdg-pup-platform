import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";

const API_URL = process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000";

export const useGetFiles = (pageNumber = 1, pageSize = 10, folderId?: string | null, path?: string) => {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["files", pageNumber, pageSize, folderId, path],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.files.GET, {
        query: { pageNumber, pageSize, folderId, path },
      });

      if (res.status === 200) return res;

      throw new Error(res.body.message);
    },
  });
};
