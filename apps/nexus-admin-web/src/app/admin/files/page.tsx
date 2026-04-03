import React from "react";
import { FileList } from "@/features/file-system/components/FileList";
import { Loader2 } from "lucide-react";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";

export const metadata = {
  title: "File Management | GDG PUP Admin",
  description: "Manage system files, uploads, and assets.",
};

const FileListLoader = () => (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-teal-600" />
        <p className="text-sm font-medium text-gray-500">Loading file manager...</p>
    </div>
);

export default function FilesPage() {
  return (
    <AdminPageScaffold pageKey="files" className="py-2">
      <React.Suspense fallback={<FileListLoader />}>
        <FileList />
      </React.Suspense>
    </AdminPageScaffold>
  );
}
