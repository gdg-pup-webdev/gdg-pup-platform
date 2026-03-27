import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export const WireframeUploadImage = ({
  image,
  setImage,
}: {
  image: File | undefined;
  setImage: (image: File | undefined) => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        Thumbnail Image
      </label>
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-sm border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <ImageIcon size={32} />
          )}
        </div>
        <div className="flex-1">
          <p className="mb-3 text-xs text-gray-500 leading-relaxed">
            Upload a thumbnail image for this resource. Recommended size:
            800x450 (16:9).
          </p>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload size={16} />
            Choose Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
