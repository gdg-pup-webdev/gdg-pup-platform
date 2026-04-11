import React from 'react';
import { Input, Text } from "@packages/spark-ui";
import { ProjectFormState } from "../types";
import { cn } from "@/lib/utils";

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] focus-within:p-[2px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles =
  "!h-auto py-2 px-3 sm:py-2.5 sm:px-4 !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";


type ProjectsManagerProps = {
  projects: ProjectFormState[];
  updateProject: (index: number, field: keyof Omit<ProjectFormState, "id">, value: string | File | null) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
};

export function ProjectsManager({ projects, updateProject, addProject, removeProject }: ProjectsManagerProps) {
  return (
    <div className="mt-6 sm:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <Text className="text-white font-semibold">Projects</Text>
        <button
          type="button"
          onClick={addProject}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          Add project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={`${project.id ?? "new"}-${index}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3"
          >
            <div className="flex justify-between items-center gap-3">
              <p className="text-sm font-medium text-zinc-300">Project {index + 1}</p>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              >
                Remove
              </button>
            </div>

              <Input
                value={project.title}
                onChange={(event) => updateProject(index, "title", event.target.value)}
                placeholder="Project title"
              containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                className="text-white! py-3"
              />

            <div className="grid gap-3 sm:grid-cols-2 mt-3">
              <StyledInputContainer>
                <input
                  type="date"
                  value={project.startDate}
                  onChange={(event) => updateProject(index, "startDate", event.target.value)}
                  className={cn(inputBaseStyles, "min-h-[50px] !py-3 w-full bg-[#0a162a] outline-none group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]")}
                />
              </StyledInputContainer>
              <StyledInputContainer>
                <input
                  type="date"
                  value={project.endDate}
                  onChange={(event) => updateProject(index, "endDate", event.target.value)}
                  className={cn(inputBaseStyles, "min-h-[50px] !py-3 w-full bg-[#0a162a] outline-none group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]")}
                />
              </StyledInputContainer>
            </div>

            <div className="mt-3">
              <StyledInputContainer>
                <textarea
                  value={project.description}
                  onChange={(event) => updateProject(index, "description", event.target.value)}
                  placeholder="Project description"
                  rows={3}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/50 px-4 py-3 text-zinc-200 outline-none transition-all placeholder:text-zinc-500 hover:border-zinc-600 focus:border-blue-500/50"
                />
              </StyledInputContainer>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-2">Main Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => updateProject(index, "mainImageFile", event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-2">Secondary Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => updateProject(index, "secondaryImageFile", event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-2">Tertiary Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => updateProject(index, "tertiaryImageFile", event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700 transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
