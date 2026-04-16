import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMemberShowcase } from "../api/updateMemberShowcase";
import { UpdateMemberShowcaseDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useUpdateMemberShowcase() {
  const queryClient = useQueryClient();
    const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: ({ id, data, thumbnailFile }: { id: string; data: UpdateMemberShowcaseDTO; thumbnailFile?: File }) =>
      updateMemberShowcase(callEndpoint, id, data, thumbnailFile),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
      queryClient.invalidateQueries({ queryKey: ["member-showcase", id] });
    },
  });
}
