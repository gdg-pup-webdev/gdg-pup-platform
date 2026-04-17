import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMemberProjects,
  createMemberProject,
  updateMemberProject,
  deleteMemberProject,
  addMemberProjectImage,
  deleteMemberProjectImage,
  reorderMemberProjectImages,
  reorderMemberProjects,
} from "../api";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { toast } from "react-toastify";
import type { ProjectFormState } from "@/features/onboarding/types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useMemberProjects(gdgId?: string) {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const callEndpoint = useCallEndpointWithToken();

  const invalidateProjectQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["memberProjects", gdgId] });
    queryClient.invalidateQueries({ queryKey: ["memberProjectsInfinite", gdgId] });
  };

  const projectsQuery = useQuery({
    queryKey: ["memberProjects", gdgId],
    queryFn: () => {
      if (!gdgId) throw new Error("No GDG ID provided");
      return getMemberProjects(callEndpoint, gdgId, token ?? undefined);
    },
    enabled: !!gdgId,
  });

  const createProject = useMutation({
    mutationFn: (data: Omit<ProjectFormState, "id">) => {
      if (!gdgId) throw new Error("No GDG ID provided");
      return createMemberProject(callEndpoint, gdgId, data, token ?? undefined);
    },
    onSuccess: () => {
      invalidateProjectQueries();
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ProjectFormState, "id"> }) => {
      return updateMemberProject(callEndpoint, id, data, token ?? undefined);
    },
    onSuccess: () => {
      invalidateProjectQueries();
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => {
      return deleteMemberProject(callEndpoint, id, token ?? undefined);
    },
    onSuccess: () => {
      invalidateProjectQueries();
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  const addProjectImage = useMutation({
    mutationFn: ({ id, image }: { id: string; image: File }) => {
      return addMemberProjectImage(callEndpoint, id, image, token ?? undefined);
    },
    onSuccess: () => {
      invalidateProjectQueries();
      toast.success("Project image added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add project image");
    },
  });

  const deleteProjectImage = useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) => {
      return deleteMemberProjectImage(callEndpoint, id, imageIndex, token ?? undefined);
    },
    onSuccess: () => {
      invalidateProjectQueries();
      toast.success("Project image deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project image");
    },
  });

  const reorderProjectImages = useMutation({
    mutationFn: ({
      id,
      fromIndex,
      toIndex,
    }: {
      id: string;
      fromIndex: number;
      toIndex: number;
    }) => {
      return reorderMemberProjectImages(callEndpoint, id, fromIndex, toIndex, token ?? undefined);
    },
    onSuccess: () => {
      invalidateProjectQueries();
      toast.success("Project images reordered successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reorder project images");
    },
  });

  const reorderProjects = useMutation({
    mutationFn: ({
      memberGdgId,
      fromIndex,
      toIndex,
    }: {
      memberGdgId: string;
      fromIndex: number;
      toIndex: number;
    }) => {
      return reorderMemberProjects(callEndpoint, memberGdgId, fromIndex, toIndex, token ?? undefined);
    },
    onSuccess: () => {
      invalidateProjectQueries();
      toast.success("Projects reordered successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reorder projects");
    },
  });

  return {
    projectsQuery,
    createProject,
    updateProject,
    deleteProject,
    addProjectImage,
    deleteProjectImage,
    reorderProjectImages,
    reorderProjects,
  };
}
