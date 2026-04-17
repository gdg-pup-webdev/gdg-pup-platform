import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLearningResource } from "../api/updateLearningResource";
import { UpdateLearningResourceDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useUpdateLearningResource() {
  const queryClient = useQueryClient();
    const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: ({ id, data, thumbnail }: { id: string; data: UpdateLearningResourceDTO; thumbnail?: File }) =>
      updateLearningResource(callEndpoint, id, data, thumbnail),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
      queryClient.invalidateQueries({ queryKey: ["learning-resources", variables.id] });
    },
  });
}
