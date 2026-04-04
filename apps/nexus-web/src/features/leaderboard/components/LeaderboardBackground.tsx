import { ASSETS } from "@/lib/constants/assets";

/* eslint-disable @next/next/no-img-element */
export function LeaderboardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[3202px] min-h-full w-[1471px] -translate-x-1/2">
        <div className="absolute left-1/2 top-0 h-[938px] w-[1501px] -translate-x-1/2">
          <img
            alt=""
            src={ASSETS.LEADERBOARD.STARS_BG}
            className="absolute inset-0 block h-full w-full max-w-none object-cover opacity-30"
          />
        </div>

        <div
          className="absolute top-[890.555px] h-[938px] w-[1501px] -translate-x-1/2"
          style={{ left: "calc(50% + 15px)" }}
        >
          <img
            alt=""
            src={ASSETS.LEADERBOARD.STARS_BG}
            className="absolute inset-0 block h-full w-full max-w-none object-cover opacity-30"
          />
        </div>

        <div className="absolute left-[-408px] top-[-723px] h-[3122.827px] w-[2204.968px]">
          <img
            alt=""
            src={ASSETS.LEADERBOARD.BLOB_GREEN_LEFT}
            className="absolute block max-w-none mix-blend-screen opacity-90"
            style={{ inset: "-18.54% 0% 0% -26.26%" }}
          />
        </div>

        <div className="absolute left-[36px] top-[-369px] h-[950px] w-[1091px]">
          <img
            alt=""
            src={ASSETS.LEADERBOARD.BLOB_BLUE_TOPLEFT}
            className="absolute block max-w-none mix-blend-screen opacity-90"
            style={{ inset: "-60.96% -53.08%" }}
          />
        </div>

        <div className="absolute left-[-234px] top-[694px] h-[640px] w-[792px]">
          <img
            alt=""
            src={ASSETS.LEADERBOARD.BLOB_BLUE_BOTTOMLEFT}
            className="absolute block max-w-none mix-blend-screen opacity-90"
            style={{ inset: "-90.48% -73.12%" }}
          />
        </div>

        <div className="absolute left-[666.83px] top-[137.79px] flex h-[1509.214px] w-[1491.171px] items-center justify-center">
          <div className="shrink-0 rotate-[39.16deg]">
            <div className="relative h-[1129.013px] w-[1003.654px]">
              <img
                alt=""
                src={ASSETS.LEADERBOARD.BLOB_BLUE_RIGHT}
                className="absolute block max-w-none mix-blend-screen opacity-90"
                style={{ inset: "-51.29% -57.7%" }}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-[714.09px] top-[1258.27px] flex h-[960.206px] w-[932.144px] items-center justify-center">
          <div className="shrink-0 -rotate-[29deg]">
            <div className="relative h-[732px] w-[660px]">
              <img
                alt=""
                src={ASSETS.LEADERBOARD.BLOB_YELLOW_RIGHT}
                className="absolute block max-w-none mix-blend-screen opacity-90"
                style={{ inset: "-59.7% -66.21%" }}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-[-74px] top-[1954px] flex h-[453.348px] w-[415.896px] items-center justify-center">
          <div className="shrink-0 rotate-[-157.23deg]">
            <div className="relative h-[367px] w-[297px]">
              <img
                alt=""
                src={ASSETS.LEADERBOARD.BLOB_BLUE_GROUP_465}
                className="absolute block max-w-none mix-blend-screen opacity-90"
                style={{ inset: "-119.07% -147.14%" }}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-[-74px] top-[2407.35px] flex h-[715.919px] w-[632.455px] items-center justify-center">
          <div className="shrink-0 rotate-[-157.23deg]">
            <div className="relative h-[593px] w-[437px]">
              <img
                alt=""
                src={ASSETS.LEADERBOARD.BLOB_BLUE_GROUP_466}
                className="absolute block max-w-none mix-blend-screen opacity-90"
                style={{ inset: "-73.69% -100%" }}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-[1069px] top-[2074.48px] flex h-[464.978px] w-[437.695px] items-center justify-center">
          <div className="shrink-0 -rotate-[29deg]">
            <div className="relative h-[367px] w-[297px]">
              <img
                alt=""
                src={ASSETS.LEADERBOARD.BLOB_RED_BOTTOMRIGHT}
                className="absolute block max-w-none mix-blend-screen opacity-90"
                style={{ inset: "-119.07% -147.14%" }}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-[-8px] top-[2775px] flex h-[421.885px] w-[463.147px] items-center justify-center">
          <div className="shrink-0 rotate-[-110.74deg]">
            <div className="relative h-[378.715px] w-[307.694px]">
              <img
                alt=""
                src={ASSETS.LEADERBOARD.ELEMENT_BOTTOMLEFT}
                className="absolute inset-0 block h-full w-full max-w-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
