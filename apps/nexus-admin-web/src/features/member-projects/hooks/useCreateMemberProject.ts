import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMemberProject } from "../api/createMemberProject";
import { CreateMemberProjectDTO } from "../types";

export function useCreateMemberProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      data, 
      files 
    }: { 
      data: CreateMemberProjectDTO; 
      files?: { mainImage?: File; secondaryImage?: File; tertiaryImage?: File } 
    }) => createMemberProject(data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
    },
  });
}
