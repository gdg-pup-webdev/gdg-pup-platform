import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMemberShowcase } from "../api/createMemberShowcase";
import { CreateMemberShowcaseDTO } from "../types";

export function useCreateMemberShowcase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, thumbnailFile }: { data: CreateMemberShowcaseDTO; thumbnailFile: File }) =>
      createMemberShowcase(data, thumbnailFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
