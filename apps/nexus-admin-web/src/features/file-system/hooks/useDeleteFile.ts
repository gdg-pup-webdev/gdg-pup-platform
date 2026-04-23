import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

const API_URL = configs.nexusApiBaseUrl;

export const useDeleteFile = () => {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.files.fileId.DELETE,
        {
          params: { fileId: id },
        }
      );

      if (res.status === 200) return res;

      throw new Error(res.body.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};
