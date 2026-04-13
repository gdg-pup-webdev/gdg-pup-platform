import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMemberProject } from "../api/createMemberProject";
import { CreateMemberProjectDTO } from "../types";

export function useCreateMemberProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: CreateMemberProjectDTO }) => createMemberProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
    },
  });
}
