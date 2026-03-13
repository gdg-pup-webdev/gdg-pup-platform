import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import type { LeaderboardEntry } from "../types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  onSeeMore?: () => void;
  showFooter?: boolean;
}

const ROW_BACKGROUND =
  "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(65,65,65,0.8) 50%, rgba(0,0,0,0.8) 100%)";

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const isHighlighted = entry.isCurrentUser;
  const row = (
    <div
      className="relative flex h-[97px] w-[1282px] items-center px-[40px]"
      style={{
        background: ROW_BACKGROUND,
        ...(isHighlighted
          ? {
              borderTop: "2px solid #BB362A",
              borderRight: "4px solid #BB362A",
              borderBottom: "2px solid #BB362A",
              borderLeft: "1px solid #BB362A",
              boxShadow:
                "1px 1px 10px 0px #196CEF, 0px 4px 46.1px 0px rgba(0,0,0,0.25), 0px 4px 4px 0px rgba(0,0,0,0.25)",
            }
          : {}),
      }}
    >
      {isHighlighted && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0px 2px 0px 0px rgba(255,255,255,0.4)" }}
        />
      )}

      <div className="relative flex w-[1202px] items-center justify-between">
        <div className="flex items-center gap-[60px]">
          <p
            className="w-[60.048px] text-[24px] font-bold leading-[33.6px] text-[#D4D4D4]"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            {entry.rank}
          </p>

          <div className="flex items-center gap-[24px]">
            <div className="relative size-[67.96px] shrink-0">
              <Image
                src={entry.avatarUrl || ASSETS.LEADERBOARD.AVATAR_PLACEHOLDER}
                alt={entry.name}
                width={68}
                height={68}
                className="size-full object-contain"
              />
            </div>

            <div className="flex w-[367.512px] flex-col items-start">
              <p
                className="whitespace-nowrap text-[24px] font-normal leading-[36px] text-white"
                style={{ fontFamily: "'Google Sans', sans-serif" }}
              >
                {entry.name}
                {isHighlighted ? " (You)" : ""}
              </p>
              <p
                className="w-[226.333px] text-[14px] font-semibold leading-[21px] text-[#D4D4D4]"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                {entry.role}
              </p>
            </div>
          </div>
        </div>

        <p
          className="w-[102px] text-center text-[20px] font-bold leading-[30px] text-white"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          {entry.points} pts
        </p>
      </div>
    </div>
  );

  if (!isHighlighted) {
    return row;
  }

  return <div className="w-[1286px]">{row}</div>;
}

function TableHeader() {
  return (
    <div className="flex h-[70px] w-[1286px] flex-col items-start rounded-t-[12px] border border-[#BB362A] bg-[rgba(255,255,255,0.1)] px-[16px] py-[18px]">
      <div className="flex w-full items-center px-[12px]">
        <div className="relative h-[34px] w-[1171px]">
          <p
            className="absolute left-[12px] top-0 w-[110.667px] text-[24px] font-bold leading-[33.6px] text-[#E5E5E5]"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Rank
          </p>
          <p
            className="absolute left-[196.076px] top-0 w-[136.898px] text-center text-[24px] font-bold leading-[33.6px] text-[#E5E5E5]"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Name
          </p>
          <p
            className="absolute left-[1046.102px] top-0 w-[136.898px] text-center text-[24px] font-bold leading-[33.6px] text-[#E5E5E5]"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Points
          </p>
        </div>
      </div>
    </div>
  );
}

function TableFooter({
  onSeeMore,
}: Pick<LeaderboardTableProps, "onSeeMore">) {
  return (
    <div className="flex h-[79px] w-[1286px] items-center justify-center rounded-b-[12px] border border-[#BB362A] bg-[rgba(255,255,255,0.15)] px-[16px] py-[18px]">
      <button
        type="button"
        onClick={onSeeMore}
        disabled={!onSeeMore}
        className="flex h-[43px] min-w-[96px] items-center justify-center border-b border-[#BB362A] p-[8px] text-[18px] font-medium leading-[27px] text-white disabled:cursor-default"
        style={{ fontFamily: "'Google Sans', sans-serif" }}
      >
        See More
      </button>
    </div>
  );
}

export function LeaderboardTable({
  entries,
  onSeeMore,
  showFooter = false,
}: LeaderboardTableProps) {
  return (
    <div className="flex w-[1286px] flex-col gap-[5px]">
      <TableHeader />
      {entries.map((entry) => (
        <LeaderboardRow key={entry.rank} entry={entry} />
      ))}
      {(showFooter || onSeeMore) && <TableFooter onSeeMore={onSeeMore} />}
    </div>
  );
}
