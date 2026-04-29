"use client";

import React from "react";
import { Plus, Users, Sparkles } from "lucide-react";
import { MemberShowcase, ShowcasedMember } from "../types";
import { MemberShowcaseCard } from "./MemberShowcaseCard";
import { useMemberShowcases } from "../hooks/useMemberShowcases";
import { useSpotlight } from "../hooks/useSpotlight";
import Image from "next/image";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

interface MemberShowcaseListProps {
  onCreate: () => void;
  onEdit: (showcase: MemberShowcase) => void;
  onDelete: (showcase: MemberShowcase) => void;
  onView: (showcase: MemberShowcase) => void;
}

export function MemberShowcaseList({ onCreate, onEdit, onDelete, onView }: MemberShowcaseListProps) {
  const { getNumber, setQueryParams } = useAdminQueryParams();

  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 8);

  const setPage = (nextPage: number) => {
    setQueryParams({ page: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ pageSize: nextPageSize, page: 1 });
  };

  const { data: listResponse, isLoading, isError } = useMemberShowcases(page, pageSize);
  const { data: spotlight, isLoading: isLoadingSpotlight } = useSpotlight();

  const showcases = listResponse?.data || [];
  const totalRecords = listResponse?.meta?.totalRecords || 0;
  const totalPages = listResponse?.meta?.totalPages || 1;

  if (isLoading) {
    return <ListLoadingState accent="teal" message="Loading showcases..." className="h-96" />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load showcases"
        message="Please check your connection and try again."
        className="h-96"
      />
    );
  }

  return (
    <AdminListScaffold
      className="space-y-6 pb-8"
      leading={
        spotlight?.data ? (
          <section className="relative overflow-hidden rounded-sm border border-teal-100 bg-linear-to-br from-teal-50/50 to-white p-6 shadow-sm">
            <div className="absolute -top-6 -right-6 text-teal-100/20">
              <Sparkles size={120} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
              <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-sm border border-white shadow-xl md:w-80">
                {spotlight.data.thumbnailUrl ? (
                  <Image src={spotlight.data.thumbnailUrl} alt={spotlight.data.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                    <Users size={48} />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                  <Sparkles size={10} />
                  Spotlight of the Day
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-2 text-2xl font-black leading-tight text-gray-900">{spotlight.data.title}</h2>
                <p className="mb-6 line-clamp-3 max-w-2xl text-sm leading-relaxed text-gray-600">
                  {spotlight.data.description}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <button
                    onClick={() => onView(spotlight.data)}
                    className="rounded-sm bg-gray-900 px-8 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95"
                  >
                    View Full Spotlight
                  </button>
                  <div className="flex items-center -space-x-2">
                    {spotlight.data.showcasedMembers.map((m: ShowcasedMember) => (
                      <div key={m.gdgId} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm" title={m.fullName}>
                        {m.avatarUrl ? <img src={m.avatarUrl} alt={m.fullName} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-400">{m.firstName[0]}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null
      }
      actions={
        <AdminActionButton
          onClick={onCreate}
          variant="teal"
          className="hover:shadow-md active:scale-95"
        >
          <Plus size={18} />
          Add New Showcase
        </AdminActionButton>
      }
      search={
        <div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">Showcase Archive</h2>
            <p className="mt-1 text-xs font-medium tracking-widest text-gray-500 uppercase">Total: {totalRecords} records found</p>
          </div>
        </div>
      }
      content={
        showcases.length > 0 ? (
          <AdminCardGrid>
            {showcases.map((showcase: MemberShowcase) => (
              <MemberShowcaseCard
                key={showcase.id}
                showcase={showcase}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AdminCardGrid>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
            <div className="rounded-full bg-white p-4 shadow-sm text-gray-300">
              <Users size={48} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">No showcases found</h3>
              <p className="mt-1 text-xs text-gray-500">Get started by creating your first member showcase.</p>
            </div>
            <AdminActionButton
              onClick={onCreate}
              variant="tealOutline"
              size="sm"
              className="mt-2"
            >
              Create New Showcase
            </AdminActionButton>
          </div>
        )
      }
      pagination={
        <AdminPaginationSection
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
          }}
        />
      }
    />
  );
}
