import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateMemberShowcaseRequest } from "./updateMemberShowcase";
import { UpdateMemberShowcaseDTO } from "../types";

export function useUpdateMemberShowcase() {
  const updateMemberShowcase = useUpdateMemberShowcaseRequest();




  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, thumbnailFile }: { id: string; data: UpdateMemberShowcaseDTO; thumbnailFile?: File }) =>
      updateMemberShowcase(id, data, thumbnailFile),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
      queryClient.invalidateQueries({ queryKey: ["member-showcase", id] });
    },
  });
}
