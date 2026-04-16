import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemberProject } from "../api/deleteMemberProject";

export function useDeleteMemberProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemberProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
    },
  });
}
