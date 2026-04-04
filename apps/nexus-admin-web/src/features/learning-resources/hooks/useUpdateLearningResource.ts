import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateLearningResourceRequest } from "./updateLearningResource";
import { UpdateLearningResourceDTO } from "../types";

export function useUpdateLearningResource() {
  const updateLearningResource = useUpdateLearningResourceRequest();




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
