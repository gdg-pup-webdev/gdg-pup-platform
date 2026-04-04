import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchApi } from "@/hooks/useFetchApi";
import { contract } from "@packages/nexus-api-contracts";

const API_URL = "http://localhost:8000";
export const useDeleteFile = () => {
  const callEndpoint = useFetchApi();
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
