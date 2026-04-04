import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

interface LeaderboardBackButtonProps {
  onClick: () => void;
}

export function LeaderboardBackButton({
  onClick,
}: LeaderboardBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[43px] w-[105px] items-center justify-center gap-[16px] rounded-[8px] px-[16px] py-[8px] transition-colors hover:bg-white/5"
    >
      <span className="flex size-[16px] items-center justify-center">
        <span className="relative block size-[22.771px]">
          <Image
            src={ASSETS.LEADERBOARD.ARROW_LEFT}
            alt=""
            fill
            sizes="22.771px"
            className="object-contain"
          />
        </span>
      </span>
      <span
        className="text-center text-[18px] font-medium leading-[27px] text-white"
        style={{ fontFamily: "'Google Sans', sans-serif" }}
      >
        Back
      </span>
    </button>
  );
}
