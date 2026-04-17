import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLearningResource } from "../api/createLearningResource";
import { CreateLearningResourceDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useCreateLearningResource() {
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, thumbnail }: { data: CreateLearningResourceDTO; thumbnail?: File }) =>
      createLearningResource(callEndpoint, data, thumbnail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
    },
  });
}
