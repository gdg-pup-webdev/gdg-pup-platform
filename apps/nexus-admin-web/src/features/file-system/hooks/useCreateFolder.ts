import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken  } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { FolderInsert } from "../types";

const API_URL = "http://localhost:8000";

export const useCreateFolder = () => {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FolderInsert) => {
      const res = await callEndpoint(API_URL, contract.api.v1.folders.POST, {
        body: { data },
      });

      if (res.status === 201) return res.body.data;

      throw new Error(res.body.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};
