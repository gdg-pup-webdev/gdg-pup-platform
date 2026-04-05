import { Button, Text, Modal } from "@packages/spark-ui";
import React, { useState, useEffect } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { addIcon } from "../icons/addIcon";
import { editIcon } from "../icons/editIcon";
import { UserProfile } from "@/features/sparkmates";
import { cn } from "@/lib/utils";
import { useMemberProjects } from "@/features/sparkmates/hooks/useMemberProjects";
import { ProjectsManager } from "@/features/onboarding/components/ProjectsManager";
import { ProjectFormState } from "@/features/onboarding/types";
import { toast } from "react-toastify";

const createEmptyProject = (): ProjectFormState => ({
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  mainImageFile: null,
  mainImageUrl: null,
  secondaryImageFile: null,
  secondaryImageUrl: null,
  tertiaryImageFile: null,
  tertiaryImageUrl: null,
});

export const ProjectsSection = ({ profile }: { profile: UserProfile }) => {
  const { projectsQuery, createProject, updateProject, deleteProject } = useMemberProjects(profile.gdgId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localProjects, setLocalProjects] = useState<ProjectFormState[]>([]);

  // Initialize local projects state from fetched data when modal opens
  useEffect(() => {
    if (isEditModalOpen && projectsQuery.data) {
      if (projectsQuery.data.length > 0) {
        setLocalProjects(
          projectsQuery.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            startDate: p.startDate ? p.startDate.slice(0, 10) : "",
            endDate: p.endDate ? p.endDate.slice(0, 10) : "",
            description: p.description,
            mainImageFile: null,
            mainImageUrl: p.mainImageUrl,
            secondaryImageFile: null,
            secondaryImageUrl: p.secondaryImageUrl,
            tertiaryImageFile: null,
            tertiaryImageUrl: p.tertiaryImageUrl,
          }))
        );
      } else {
        setLocalProjects([createEmptyProject()]);
      }
    }
  }, [isEditModalOpen, projectsQuery.data]);

  const handleUpdateProject = (index: number, field: keyof Omit<ProjectFormState, "id">, value: string | File | null) => {
    setLocalProjects((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      
      if (field === "mainImageFile") {
        next[index].mainImageFile = value as File | null;
      } else if (field === "secondaryImageFile") {
        next[index].secondaryImageFile = value as File | null;
      } else if (field === "tertiaryImageFile") {
        next[index].tertiaryImageFile = value as File | null;
      } else {
        (next[index] as any)[field] = value;
      }
      return next;
    });
  };

  const handleAddProject = () => {
    setLocalProjects((prev) => [...prev, createEmptyProject()]);
  };

  const handleRemoveProject = async (index: number) => {
    const projectToRemove = localProjects[index];
    if (projectToRemove.id) {
      if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        await deleteProject.mutateAsync(projectToRemove.id);
      } else {
        return;
      }
    }
    
    setLocalProjects((prev) => {
      if (prev.length === 1) return [createEmptyProject()];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = async () => {
    try {
      const validProjects = localProjects.filter((p) => p.title.trim() && p.description.trim() && p.startDate);
      
      for (const project of validProjects) {
        if (project.id) {
          await updateProject.mutateAsync({ id: project.id, data: project });
        } else {
          await createProject.mutateAsync(project);
        }
      }
      setIsEditModalOpen(false);
      projectsQuery.refetch();
    } catch (error) {
      toast.error("Failed to save projects");
    }
  };

  const isSaving = createProject.isPending || updateProject.isPending;
  const projectList = projectsQuery.data || [];

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between gap-3">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Projects
        </Text>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white"
          title="Edit Projects"
          aria-label="Edit Projects"
          onClick={() => setIsEditModalOpen(true)}
        >
          {editIcon}
        </Button>
      </div>
      <Text variant="body-sm" className="text-[#C1C7CD]">
        Feature your best works to highlight your skills.
      </Text>
      
      <div className="space-y-3.5">
        {projectsQuery.isLoading ? (
          <Text variant="body-sm" className="text-zinc-500">Loading projects...</Text>
        ) : projectList.length > 0 ? (
          projectList.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-center text-[#C1C7CD]">
            <Text variant="body-sm">No projects added yet.</Text>
          </div>
        )}
      </div>

      {projectList.length === 0 && (
        <Button 
          variant="dashed-outline" 
          className="w-full" 
          iconLeft={addIcon}
          onClick={() => setIsEditModalOpen(true)}
        >
          Add New Projects
        </Button>
      )}

      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} scrollBehavior="inside" size="md" className="bg-transparent border-none p-0 !shadow-none isolate">
        <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/80 backdrop-blur-2xl px-6 py-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <div className="space-y-6">
          <div>
            <Text variant="heading-6" weight="bold" gradient="white-yellow">Manage Projects</Text>
            <Text variant="body-sm" className="text-zinc-400 mt-1">
              Add your best works and projects to showcase your skills in action.
            </Text>
          </div>
          
          <ProjectsManager
            projects={localProjects}
            updateProject={handleUpdateProject}
            addProject={handleAddProject}
            removeProject={handleRemoveProject}
          />
          
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800/80">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="colored" subVariant="blue" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
        </div>
      </Modal>
    </section>
  );
};
