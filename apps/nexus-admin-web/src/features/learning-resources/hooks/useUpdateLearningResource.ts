import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLearningResource } from "../api/updateLearningResource";
import { UpdateLearningResourceDTO } from "../types";

export function useUpdateLearningResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, thumbnail }: { id: string; data: UpdateLearningResourceDTO; thumbnail?: File }) =>
      updateLearningResource(id, data, thumbnail),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
      queryClient.invalidateQueries({ queryKey: ["learning-resources", variables.id] });
    },
  });
}
