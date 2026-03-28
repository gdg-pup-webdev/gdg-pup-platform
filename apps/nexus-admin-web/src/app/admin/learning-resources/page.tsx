"use client";

import { LearningResourceList } from "@/features/learning-resources";

export default function LearningResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
        <p className="mt-1 text-gray-500">
          Manage courses, study jams, blogs, and other learning materials.
        </p>
      </div>

      {/* Main Content */}
      <LearningResourceList />
    </div>
  );
}
