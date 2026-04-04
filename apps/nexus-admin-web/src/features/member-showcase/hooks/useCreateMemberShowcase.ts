import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateMemberShowcaseRequest } from "./createMemberShowcase";
import { CreateMemberShowcaseDTO } from "../types";

export function useCreateMemberShowcase() {
  const createMemberShowcase = useCreateMemberShowcaseRequest();




  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, thumbnailFile }: { data: CreateMemberShowcaseDTO; thumbnailFile: File }) =>
      createMemberShowcase(data, thumbnailFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
