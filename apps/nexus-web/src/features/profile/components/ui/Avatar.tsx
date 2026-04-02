"use client";

import * as React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export const Avatar = ({ className = "", src, alt, children, ...props }: AvatarProps) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 ${className}`}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium text-gray-500 uppercase">
          {children}
        </div>
      )}
    </div>
  );
};
