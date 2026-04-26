import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemberShowcase } from "../api/deleteMemberShowcase";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useDeleteMemberShowcase() {
  const queryClient = useQueryClient();
    const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: (id: string) => deleteMemberShowcase(callEndpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
