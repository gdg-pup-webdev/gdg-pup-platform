import React from "react";
import { FileList } from "@/features/file-system/components/FileList";
import { Files } from "lucide-react";

export const metadata = {
  title: "File Management | GDG PUP Admin",
  description: "Manage system files, uploads, and assets.",
};

export default function FilesPage() {
  return (
    <div className="container mx-auto py-8">
      {/* Page Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-teal-600 text-white shadow-lg">
          <Files size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">File System</h1>
          <p className="mt-1 font-medium text-gray-500">
            Upload, manage, and organize assets across the platform.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <FileList />
    </div>
  );
}
