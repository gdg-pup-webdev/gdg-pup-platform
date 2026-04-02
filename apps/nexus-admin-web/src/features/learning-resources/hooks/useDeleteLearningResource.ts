import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLearningResource } from "../api/deleteLearningResource";

export function useDeleteLearningResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLearningResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
    },
  });
}
