import { ASSETS } from "@/lib/constants/assets";
import Image from "next/image";

const SIZE_MAP = {
  md: { outer: "h-43 w-43", inner: "h-41 w-41" },
  sm: { outer: "h-32 w-32", inner: "h-30 w-30" },
} as const;

export function GradientProfilePicture({
  src, alt, fallback, size = "md",
}: {
  src?: string;
  alt: string;
  fallback: string;
  size?: "md" | "sm";
}) {
  const { outer, inner } = SIZE_MAP[size];
  return (
    <div className={`relative ${outer} shrink-0`}>
      <div className="absolute inset-0">
        <Image
          src={ASSETS.PROFILE.AVATAR_RING}
          alt=""
          aria-hidden
          fill
          className="object-contain"
        />
      </div>
      <div className={`absolute left-1/2 top-1/2 ${inner} -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full flex justify-center items-center`}>
        <Image
          src={src || ASSETS.PROFILE.DEFAULT_AVATAR}
          alt={alt}
          className="object-cover w-full h-full"
          fill
        />
      </div>
    </div>
  );
}
