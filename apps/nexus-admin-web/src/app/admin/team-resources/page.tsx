"use client";

import { TeamResourceList } from "@/features/team-resources";

export default function TeamResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Resources</h1>
        <p className="mt-1 text-gray-500">
          Manage shared documents, tools, and assets for GDG PUP teams.
        </p>
      </div>

      {/* Main Content */}
      <TeamResourceList />
    </div>
  );
}
