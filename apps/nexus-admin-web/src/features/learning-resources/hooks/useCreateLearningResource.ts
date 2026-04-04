import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateLearningResourceRequest } from "./createLearningResource";
import { CreateLearningResourceDTO } from "../types";

export function useCreateLearningResource() {
  const createLearningResource = useCreateLearningResourceRequest();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, thumbnail }: { data: CreateLearningResourceDTO; thumbnail?: File }) =>
      createLearningResource(data, thumbnail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
    },
  });
}
