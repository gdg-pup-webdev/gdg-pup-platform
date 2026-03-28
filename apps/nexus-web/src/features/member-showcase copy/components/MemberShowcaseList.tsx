"use client";

import React, { useState } from "react";
import { Plus, Loader2, Search, AlertCircle, Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { MemberShowcase } from "../types";
import { MemberShowcaseCard } from "./MemberShowcaseCard";
import { useMemberShowcases } from "../hooks/useMemberShowcases";
import { useSpotlight } from "../hooks/useSpotlight";
import Image from "next/image";

interface MemberShowcaseListProps {
  onCreate: () => void;
  onEdit: (showcase: MemberShowcase) => void;
  onDelete: (showcase: MemberShowcase) => void;
  onView: (showcase: MemberShowcase) => void;
}

export function MemberShowcaseList({ onCreate, onEdit, onDelete, onView }: MemberShowcaseListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { data: listResponse, isLoading, isError } = useMemberShowcases(page, pageSize);
  const { data: spotlight, isLoading: isLoadingSpotlight } = useSpotlight();

  const showcases = listResponse?.data || [];
  const totalRecords = listResponse?.meta?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-sm font-medium text-gray-500 italic">Loading showcases...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-red-200 bg-red-50/30 p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h3 className="text-lg font-bold text-red-900">Failed to load showcases</h3>
          <p className="mt-1 text-sm text-red-700">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Spotlight Section */}
      {spotlight?.data && (
        <section className="relative overflow-hidden rounded-sm border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-6 shadow-sm">
          <div className="absolute -top-6 -right-6 text-teal-100/20">
            <Sparkles size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="relative h-48 w-full md:w-80 shrink-0 overflow-hidden rounded-sm border border-white shadow-xl">
              {spotlight.data.thumbnailUrl ? (
                <Image src={spotlight.data.thumbnailUrl} alt={spotlight.data.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                  <Users size={48} />
                </div>
              )}
              <div className="absolute top-3 left-3 rounded-full bg-teal-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg flex items-center gap-1.5">
                <Sparkles size={10} />
                Spotlight of the Day
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{spotlight.data.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed max-w-2xl">
                {spotlight.data.description}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <button
                  onClick={() => onView(spotlight.data)}
                  className="rounded-sm bg-gray-900 px-8 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95"
                >
                  View Full Spotlight
                </button>
                <div className="flex items-center -space-x-2">
                  {spotlight.data.showcasedMembers.map(m => (
                    <div key={m.gdgId} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm" title={m.fullName}>
                      {m.avatarUrl ? <img src={m.avatarUrl} alt={m.fullName} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-gray-400">{m.firstName[0]}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main List Section */}
      <section>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Showcase Archive</h2>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">Total: {totalRecords} records found</p>
          </div>
          <button
            onClick={onCreate}
            className="flex items-center justify-center gap-2 rounded-sm bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-md active:scale-95"
          >
            <Plus size={18} />
            Add New Showcase
          </button>
        </div>

        {showcases.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {showcases.map((showcase: MemberShowcase) => (
                <MemberShowcaseCard
                  key={showcase.id}
                  showcase={showcase}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-10 w-10 rounded-sm text-sm font-bold transition-all ${
                      page === p
                        ? "bg-teal-600 text-white shadow-md scale-110"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
            <div className="rounded-full bg-white p-4 shadow-sm text-gray-300">
              <Users size={48} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">No showcases found</h3>
              <p className="mt-1 text-xs text-gray-500">Get started by creating your first member showcase.</p>
            </div>
            <button
              onClick={onCreate}
              className="mt-2 text-sm font-bold text-teal-600 hover:text-teal-700 underline underline-offset-4"
            >
              Create New Showcase
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
