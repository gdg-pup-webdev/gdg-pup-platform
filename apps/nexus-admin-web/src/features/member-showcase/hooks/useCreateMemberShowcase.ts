import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMemberShowcase } from "../api/createMemberShowcase";
import { CreateMemberShowcaseDTO } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useCreateMemberShowcase() {
  const queryClient = useQueryClient();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: ({ data, thumbnailFile }: { data: CreateMemberShowcaseDTO; thumbnailFile: File }) =>
      createMemberShowcase(callEndpoint, data, thumbnailFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-showcases"] });
    },
  });
}
