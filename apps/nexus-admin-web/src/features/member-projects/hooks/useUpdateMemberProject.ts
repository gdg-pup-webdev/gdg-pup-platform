import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberProject } from "../api/updateMemberProject";
import { UpdateMemberProjectDTO } from "../types";

export function useUpdateMemberProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberProjectDTO }) => updateMemberProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
      queryClient.invalidateQueries({ queryKey: ["member-projects", "detail", id] });
    },
  });
}
