import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMemberProject } from "../api/createMemberProject";
import { CreateMemberProjectDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useCreateMemberProject() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      data, 
      files 
    }: { 
      data: CreateMemberProjectDTO; 
      files?: { mainImage?: File; secondaryImage?: File; tertiaryImage?: File } 
    }) => createMemberProject(callEndpoint, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
    },
  });
}
