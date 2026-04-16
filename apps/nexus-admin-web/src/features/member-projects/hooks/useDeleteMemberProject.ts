import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemberProject } from "../api/deleteMemberProject";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useDeleteMemberProject() {
  const queryClient = useQueryClient();
    const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: (id: string) => deleteMemberProject(callEndpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-projects"] });
    },
  });
}
