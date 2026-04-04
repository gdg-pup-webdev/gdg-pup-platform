import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import type { PodiumEntry } from "../types";

interface LeaderboardPodiumProps {
  gold: PodiumEntry;
  silver: PodiumEntry;
  bronze: PodiumEntry;
}

export function LeaderboardPodium({
  gold,
  silver,
  bronze,
}: LeaderboardPodiumProps) {
  return (
    <div className="relative h-[623.996px] w-[1200px]">
      <div className="absolute left-0 top-[152.592px] h-[471.404px] w-[1200px]">
        <div
          className="absolute left-[255.46px] top-0 flex h-[471.404px] w-[646.666px] items-center justify-center mix-blend-screen"
          style={{ filter: "blur(50px)" }}
        >
          <div className="-scale-y-100 rotate-[-74.26deg]">
            <div className="relative h-[579.883px] w-[326.295px]">
              <Image
                src={ASSETS.LEADERBOARD.GOLD_TEXTURE}
                alt=""
                fill
                sizes="326.295px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 h-[199.168px] w-[1200px] -translate-x-1/2">
          <Image
            src={ASSETS.LEADERBOARD.DIAL_GROUP_248}
            alt=""
            fill
            sizes="1200px"
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute left-[181.822px] top-0 h-[467.006px] w-[836.356px]">
        <div className="absolute left-0 top-[146.006px] h-[321px] w-[246px]">
          <div className="absolute left-0 top-[75px] size-[246px] rounded-bl-[24px] rounded-tl-[24px] border-[3px] border-[#A1A1A1] bg-[rgba(115,115,115,0.2)]" />
          <div className="absolute left-[9px] top-[187px] flex w-[227px] flex-col items-center gap-[10px]">
            <p
              className="w-[240.843px] text-center text-[24px] font-normal leading-[36px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {silver.name}
            </p>
            <p
              className="min-w-full text-center text-[24px] font-bold leading-[33.6px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {silver.points} pts
            </p>
          </div>
          <div className="absolute left-[48px] top-0 size-[150px]">
            <Image
              src={silver.avatarUrl || ASSETS.LEADERBOARD.AVATAR_SILVER}
              alt={silver.name}
              fill
              sizes="150px"
              className="object-contain"
            />
          </div>
          <div className="absolute left-[98px] top-[125px] flex size-[50px] items-center justify-center rounded-[25px] bg-[#A1A1A1]">
            <span
              className="text-center text-[24px] font-bold leading-[33.6px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              2
            </span>
          </div>
        </div>

        <div className="absolute left-[246px] top-0 h-[467.006px] w-[342.732px]">
          <div className="absolute left-0 top-[100px] h-[367.006px] w-[342.732px] rounded-tl-[24px] rounded-tr-[24px] border-[3px] border-[#FFD427] bg-[rgba(153,127,23,0.2)]" />
          <div className="absolute left-[41px] top-[235px] flex w-[260px] flex-col items-center gap-[10px]">
            <p
              className="w-[240.843px] text-center text-[32px] font-bold leading-[44.8px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {gold.name}
            </p>
            <p
              className="min-w-full text-center text-[40px] font-bold leading-[52px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {gold.points} pts
            </p>
          </div>
          <div className="absolute left-[71px] top-0 size-[200px]">
            <Image
              src={gold.avatarUrl || ASSETS.LEADERBOARD.AVATAR_GOLD}
              alt={gold.name}
              fill
              sizes="200px"
              className="object-contain"
            />
          </div>
          <div className="absolute left-[146px] top-[175px] flex size-[50px] items-center justify-center rounded-[25px] bg-gradient-to-t from-[#FFD427] to-[#997F17]">
            <span
              className="text-center text-[24px] font-bold leading-[33.6px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              1
            </span>
          </div>
        </div>

        <div className="absolute left-[588.732px] top-[181.003px] h-[286.003px] w-[247.624px]">
          <div className="absolute left-0 top-[75px] h-[211.003px] w-[247.624px] rounded-br-[24px] rounded-tr-[24px] border-[3px] border-[#733E0A] bg-[rgba(115,62,10,0.2)]" />
          <div className="absolute left-[6px] top-[181px] flex w-[235px] flex-col items-center gap-[10px]">
            <p
              className="w-[240.843px] text-center text-[24px] font-normal leading-[36px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {bronze.name}
            </p>
            <p
              className="min-w-full text-center text-[24px] font-bold leading-[33.6px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {bronze.points} pts
            </p>
          </div>
          <div className="absolute left-[49px] top-0 size-[150px]">
            <Image
              src={bronze.avatarUrl || ASSETS.LEADERBOARD.AVATAR_BRONZE}
              alt={bronze.name}
              fill
              sizes="150px"
              className="object-contain"
            />
          </div>
          <div className="absolute left-[99px] top-[125px] flex size-[50px] items-center justify-center rounded-[25px] bg-[#733E0A]">
            <span
              className="text-center text-[24px] font-bold leading-[33.6px] text-white"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
