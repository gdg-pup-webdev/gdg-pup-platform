import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateMemberProjectRequest } from "./updateMemberProject";
import { UpdateMemberProjectDTO } from "../types";

export function useUpdateMemberProject() {
  const updateMemberProject = useUpdateMemberProjectRequest();




  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      data, 
      files 
    }: { 
      id: string; 
      data: UpdateMemberProjectDTO; 
      files?: { mainImage?: File; secondaryImage?: File; tertiaryImage?: File } 
    }) => updateMemberProject(id, data, files),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
      queryClient.invalidateQueries({ queryKey: ["member-projects", "detail", id] });
    },
  });
}
