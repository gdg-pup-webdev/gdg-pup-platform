"use client";

import React from "react";
import { Calendar, User, Layout } from "lucide-react";
import { MemberProject } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface MemberProjectCardProps {
  project: MemberProject;
  onView: (project: MemberProject) => void;
  onEdit: (project: MemberProject) => void;
  onDelete: (project: MemberProject) => void | Promise<void>;
}

export function MemberProjectCard({ project, onView, onEdit, onDelete }: MemberProjectCardProps) {
  const startLabel = new Date(project.startDate).toLocaleDateString(undefined, { month: "short", year: "numeric" });
  const endLabel = project.endDate
    ? new Date(project.endDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "Present";

  return (
    <AdminEntityCard
      title={project.title}
      description={project.description}
      mediaImageUrl={project.mainImageUrl}
      mediaAlt={project.title}
      mediaFallback={<Layout size={54} strokeWidth={1.2} />}
      mediaLabel={
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          <Calendar size={11} />
          {startLabel} - {endLabel}
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          Project
        </span>
      }
      footer={
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <User size={12} />
          </span>
          <span>{project.memberGdgId}</span>
        </div>
      }
      onClick={() => onView(project)}
      actions={{
        onView: () => onView(project),
        onEdit: () => onEdit(project),
        onDelete: () => onDelete(project),
        editLabel: "Update Project",
        deleteDialogTitle: "Delete Project",
        deleteDialogDescription: (
          <>
            Project <strong>{project.title}</strong> will be permanently deleted.
          </>
        ),
      }}
    />
  );
}

export function MemberProjectCardSkeleton() {
  return (
    <Card className="h-120 flex flex-col">
      <CardHeader>
        <Skeleton className="h-40 w-full" />
      </CardHeader>
      <CardContent className="grow">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-1/2" />
      </CardFooter>
    </Card>
  );
}
