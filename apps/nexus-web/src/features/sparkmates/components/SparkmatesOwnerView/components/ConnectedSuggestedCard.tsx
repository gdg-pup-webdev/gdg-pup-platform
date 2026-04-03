"use client";
import { ASSETS } from "@/lib/constants/assets";
import { Text, Avatar } from "@packages/spark-ui"; 
import Link from "next/link";

export function ConnectedSuggestedCard({
  avatarUrl, name, bio,gdgId
}: {
  avatarUrl?: string;
  name: string;
  bio: string;
  gdgId : string;
}) {
  return (
    <Link href={`/sparkmates/${gdgId}`} className="relative flex items-center pl-11.5">
      <div className="w-full overflow-hidden rounded-r-2xl border border-white/20 bg-[rgba(255,255,255,0.05)] pl-16 pr-4 py-3.5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
        <Text variant="body-lg" className="truncate text-white" weight="medium">
          {name}
        </Text>
        <Text variant="body-sm" className="truncate text-[#E5E5E5]">
          {bio}
        </Text>
      </div>

      <div className="absolute left-0 top-1/2 h-23.5 w-23.5 -translate-y-1/2">
        <img
          src={ASSETS.PROFILE.AVATAR_RING}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain" />
        <div className="absolute left-1/2 top-1/2 h-21.5 w-21.5 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
          <Avatar
            src={avatarUrl}
            alt={name}
            fallback={name.charAt(0)}
            className="h-full w-full rounded-full" />
        </div>
      </div>
    </Link >
  );
}
