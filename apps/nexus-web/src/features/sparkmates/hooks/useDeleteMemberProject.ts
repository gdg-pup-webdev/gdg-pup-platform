import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/nexus-toast";
import { deleteMemberProject } from "../api";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

type UseDeleteMemberProjectOptions = {
  memberGdgId?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: Error) => void;
};

export function useDeleteMemberProject(options?: UseDeleteMemberProjectOptions) {
  const { token } = useAuthContext();
  const callEndpoint = useCallEndpointWithToken();
  const queryClient = useQueryClient();

  const invalidateProjectQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["memberProjects", options?.memberGdgId] });
    queryClient.invalidateQueries({ queryKey: ["memberProjectsInfinite", options?.memberGdgId] });
    queryClient.invalidateQueries({ queryKey: ["memberProjectsPage", options?.memberGdgId] });
  }, [options?.memberGdgId, queryClient]);

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!projectId?.trim()) {
        throw new Error("Project ID is required");
      }

      return deleteMemberProject(callEndpoint, projectId, token ?? undefined);
    },
    onSuccess: async () => {
      invalidateProjectQueries();
      toast.success("Project deleted successfully");
      await options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(error.message || "Failed to delete project");
    },
  });
}
