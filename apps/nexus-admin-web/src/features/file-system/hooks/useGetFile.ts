import { useQuery } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";

const API_URL = "http://localhost:8000";

export const useGetFile = (id: string) => {
  return useQuery({
    queryKey: ["file", id],
    queryFn: async () => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.files.fileId.GET,
        {
          params: { fileId: id },
        }
      );

      if (res.status === 200) return res;

      throw new Error(res.body.message);
    },
    enabled: !!id,
  });
};
