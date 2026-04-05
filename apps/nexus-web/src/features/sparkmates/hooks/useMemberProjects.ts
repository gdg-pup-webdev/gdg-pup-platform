import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMemberProjects, createMemberProject, updateMemberProject, deleteMemberProject } from "../api";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { toast } from "react-toastify";
import type { ProjectFormState } from "@/features/onboarding/types";

export function useMemberProjects(gdgId?: string) {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["memberProjects", gdgId],
    queryFn: () => {
      if (!gdgId) throw new Error("No GDG ID provided");
      return getMemberProjects(gdgId, token ?? undefined);
    },
    enabled: !!gdgId,
  });

  const createProject = useMutation({
    mutationFn: (data: Omit<ProjectFormState, "id">) => {
      if (!gdgId) throw new Error("No GDG ID provided");
      return createMemberProject(gdgId, data, token ?? undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberProjects", gdgId] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ProjectFormState, "id"> }) => {
      return updateMemberProject(id, data, token ?? undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberProjects", gdgId] });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => {
      return deleteMemberProject(id, token ?? undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberProjects", gdgId] });
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  return {
    projectsQuery,
    createProject,
    updateProject,
    deleteProject,
  };
}
