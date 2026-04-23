import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

const API_URL = configs.nexusApiBaseUrl;

export const useGetFolder = (folderId: string | null) => {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["folder", folderId],
    queryFn: async () => {
      if (!folderId) return null;
      
      const res = await callEndpoint(API_URL, contract.api.v1.folders.folderId.GET, {
        params: { folderId },
      });

      if (res.status === 200) return res.body.data;

      throw new Error(res.body.message);
    },
    enabled: !!folderId,
  });
};
