import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { FileRecordInsert } from "../types";

const API_URL = "http://localhost:8000";

export const useUploadFile = () => {
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
