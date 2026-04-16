import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemberShowcase } from "../api/deleteMemberShowcase";

export function useDeleteMemberShowcase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemberShowcase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
