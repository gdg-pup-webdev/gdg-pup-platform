import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeleteMemberShowcaseRequest } from "./deleteMemberShowcase";

export function useDeleteMemberShowcase() {
  const deleteMemberShowcase = useDeleteMemberShowcaseRequest();




  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemberShowcase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
