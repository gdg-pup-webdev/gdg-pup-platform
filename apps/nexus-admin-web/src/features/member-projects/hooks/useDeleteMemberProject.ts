import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeleteMemberProjectRequest } from "./deleteMemberProject";

export function useDeleteMemberProject() {
  const deleteMemberProject = useDeleteMemberProjectRequest();




  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemberProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
    },
  });
}
