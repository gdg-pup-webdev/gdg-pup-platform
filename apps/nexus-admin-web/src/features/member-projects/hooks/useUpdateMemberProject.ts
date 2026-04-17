import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberProject } from "../api/updateMemberProject";
import { UpdateMemberProjectDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useUpdateMemberProject() {
  const queryClient = useQueryClient();
    const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: ({ 
      id, 
      data, 
      files 
    }: { 
      id: string; 
      data: UpdateMemberProjectDTO; 
      files?: { mainImage?: File; secondaryImage?: File; tertiaryImage?: File } 
    }) => updateMemberProject(callEndpoint, id, data, files),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
      queryClient.invalidateQueries({ queryKey: ["member-projects", "detail", id] });
    },
  });
}
