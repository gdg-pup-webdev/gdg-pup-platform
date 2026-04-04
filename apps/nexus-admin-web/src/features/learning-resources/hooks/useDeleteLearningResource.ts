import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeleteLearningResourceRequest } from "./deleteLearningResource";

export function useDeleteLearningResource() {
  const deleteLearningResource = useDeleteLearningResourceRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLearningResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
    },
  });
}
