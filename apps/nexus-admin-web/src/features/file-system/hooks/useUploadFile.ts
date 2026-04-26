import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { FileRecordInsert } from "../types";
import { configs } from "@/lib/constants/configs";

const API_URL = configs.nexusApiBaseUrl;

export const useUploadFile = () => {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data, file }: { data: FileRecordInsert; file: File }) => {
      const res = await callEndpoint(API_URL, contract.api.v1.files.POST, {
        body: {
          data,
        },
        files: {
          file,
        },
      } as any);

      if (res.status === 200) return res;

      throw new Error(res.body.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};
