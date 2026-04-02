import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLearningResource } from "../api/createLearningResource";
import { CreateLearningResourceDTO } from "../types";

export function useCreateLearningResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, thumbnail }: { data: CreateLearningResourceDTO; thumbnail?: File }) =>
      createLearningResource(data, thumbnail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
    },
  });
}
