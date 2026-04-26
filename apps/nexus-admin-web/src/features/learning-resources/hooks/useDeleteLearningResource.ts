import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLearningResource } from "../api/deleteLearningResource";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useDeleteLearningResource() {
  const queryClient = useQueryClient();
    const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: (id: string) => deleteLearningResource(callEndpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-resources"] });
    },
  });
}
