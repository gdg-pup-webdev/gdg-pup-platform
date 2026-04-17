import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { FileRecordUpdate } from "../types";

const API_URL = "http://localhost:8000";

export const useUpdateFile = () => {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FileRecordUpdate }) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.files.fileId.PATCH,
        {
          params: { fileId: id },
          body: { data },
        }
      );

      if (res.status === 200) return res;

      throw new Error(res.body.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["file", variables.id] });
    },
  });
};
