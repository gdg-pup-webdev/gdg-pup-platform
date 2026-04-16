import { useQuery } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";

const API_URL = "http://localhost:8000";

export const useGetFolder = (folderId: string | null) => {
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
