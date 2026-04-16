import React from 'react';

type ProfilePictureUploadProps = {
  previewUrl: string | null;
  setProfileFile: (file: File | null) => void;
};

export function ProfilePictureUpload({ previewUrl, setProfileFile }: ProfilePictureUploadProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-inner flex flex-col h-full">
      <p className="mb-4 text-sm font-medium text-zinc-400">Profile Picture</p>
      <label className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950/50 transition-all hover:border-blue-500/50 hover:bg-zinc-900/80">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className="rounded-full bg-zinc-800 p-3 text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300">
              Click to upload photo
            </span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => setProfileFile(event.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
