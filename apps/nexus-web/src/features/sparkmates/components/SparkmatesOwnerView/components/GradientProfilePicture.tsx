 
import { ASSETS } from "@/lib/constants/assets";
import Image from "next/image";

export function GradientProfilePicture({
  src, alt, fallback,
}: {
  src?: string;
  alt: string;
  fallback: string;
}) {
  return (
    <div className="relative h-43 w-43 shrink-0">
      <img
        src={ASSETS.PROFILE.AVATAR_RING}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain" />
      <div className="absolute left-1/2 top-1/2 h-41 w-41 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full flex justify-center items-center">
      <Image 
        src={src || ASSETS.PROFILE.DEFAULT_AVATAR}
        alt={alt}
        className="object-cover w-full h-full"
          fill
      ></Image>
      </div>
    </div>
  );
}
