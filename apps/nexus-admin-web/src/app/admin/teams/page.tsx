"use client";

import { TeamList } from "@/features/teams";

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Teams</h1>
        <p className="mt-1 text-gray-500">
          Create, update, and manage GDG PUP organizational teams and their responsibilities.
        </p>
      </div>

      {/* Main Content */}
      <TeamList />
    </div>
  );
}
