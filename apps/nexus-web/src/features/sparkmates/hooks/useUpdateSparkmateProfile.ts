import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSparkmateProfile } from "../api";
import type { UserProfile } from "../types";
import { toast } from "react-toastify";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useUpdateSparkmateProfile(gdgId?: string) {
  const queryClient = useQueryClient();
  const callEndpoint = useCallEndpointWithToken();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!gdgId) throw new Error("No GDG ID provided");
      return updateSparkmateProfile({ callEndpoint , gdgId, data });
    },
    onSuccess: () => {
      if (gdgId) {
        queryClient.invalidateQueries({
          queryKey: ["sparkmateProfile", gdgId],
        });
        queryClient.invalidateQueries({
          queryKey: ["sparkmates-profile", gdgId],
        });
        queryClient.invalidateQueries({
          queryKey: ["sparkmates", "profile", gdgId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
