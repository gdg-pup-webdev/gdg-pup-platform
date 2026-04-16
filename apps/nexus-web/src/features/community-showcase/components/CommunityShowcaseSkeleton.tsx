import { Container, Stack } from "@packages/spark-ui";
import { BrandedSkeleton } from "@/components/shared";

function FeaturedEventCardSkeleton() {
  return (
    <Stack gap="xs" className="mt-12">
      {/* Heading block */}
      <Stack gap="xs" className="items-center">
        <BrandedSkeleton className="h-10 w-1/2 max-w-lg" />
        <BrandedSkeleton className="h-5 w-1/3 max-w-xs mt-1" variant="text" />
        <BrandedSkeleton className="h-4 w-28 mt-4" variant="text" />
      </Stack>

      {/* Gradient-bordered event image */}
      <div className="relative left-1/2 mt-15 flex w-[calc(100vw-2rem)] max-w-[1450px] -translate-x-1/2 justify-center z-10">
        <BrandedSkeleton
          className="w-full h-[clamp(200px,25vw,360px)] rounded-[32px]"
          withGradientRing
        />
      </div>

      {/* About + Stats row */}
      <div className="relative left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[1450px] flex justify-center mt-10 z-10">
        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* About text lines */}
          <Stack gap="sm" className="flex-2">
            <BrandedSkeleton className="h-5 w-36" variant="text" />
            <BrandedSkeleton className="h-4 w-full" variant="text" />
            <BrandedSkeleton className="h-4 w-5/6" variant="text" />
            <BrandedSkeleton className="h-4 w-4/6" variant="text" />
            <BrandedSkeleton className="h-4 w-3/4" variant="text" />
          </Stack>

          {/* Vertical divider */}
          <div className="hidden md:block w-[2px] bg-white/10" />

          {/* Stats */}
          <Stack gap="none" className="flex-1 items-end justify-between">
            <div>
              <BrandedSkeleton className="h-12 w-20" />
              <BrandedSkeleton className="h-4 w-14 mt-2" variant="text" />
            </div>
            <BrandedSkeleton className="h-9 w-28 rounded-2xl" variant="chip" />
          </Stack>
        </div>
      </div>
    </Stack>
  );
}

function PastEventsCarouselSkeleton() {
  return (
    <Stack gap="xs" className="mt-22">
      <Stack gap="xs" className="z-10 items-center">
        <BrandedSkeleton className="h-10 w-52" />
        <BrandedSkeleton className="h-5 w-80 mt-1" variant="text" />

        <div className="relative mt-10 flex items-center justify-center gap-4 lg:gap-10 xl:gap-20 w-full">
          {/* Left arrow */}
          <BrandedSkeleton className="h-15 w-15 rounded-full shrink-0" />

          <div className="flex gap-8 md:gap-12 lg:gap-28 xl:gap-40 2xl:gap-35 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-4 shrink-0 w-[clamp(180px,16vw,320px)]"
              >
                <BrandedSkeleton
                  className="rounded-full"
                  style={{
                    width: "clamp(140px,14vw,260px)",
                    height: "clamp(140px,14vw,260px)",
                  }}
                />
                <BrandedSkeleton className="h-4 w-20" variant="text" />
                <BrandedSkeleton className="h-4 w-28" variant="text" />
                <BrandedSkeleton className="h-10 w-34 rounded-lg" variant="button" />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <BrandedSkeleton className="h-15 w-15 rounded-full shrink-0" />
        </div>
      </Stack>
    </Stack>
  );
}

function DesktopShowcaseSkeleton() {
  return (
    <Container>
      <Stack gap="2xl" className="hidden md:flex relative z-10 gap-32">
        {/* Section heading */}
        <Stack gap="md" className="items-center">
          <BrandedSkeleton className="h-14 w-2/3 max-w-xl" />
          <BrandedSkeleton className="h-7 w-1/2 max-w-md mt-1" variant="text" />
        </Stack>

        <FeaturedEventCardSkeleton />
        <FeaturedEventCardSkeleton />
        <PastEventsCarouselSkeleton />
      </Stack>
    </Container>
  );
}

function MobileShowcaseSkeleton() {
  return (
    <div className="md:hidden relative z-10">
      {/* Section heading */}
      <Stack gap="md" className="items-center mb-12">
        <BrandedSkeleton className="h-8 w-3/4 max-w-xs" />
        <BrandedSkeleton className="h-5 w-2/3 max-w-xs" variant="text" />
      </Stack>

      {/* Featured event */}
      <Stack gap="xs" className="mb-10">
        <BrandedSkeleton className="h-7 w-3/4 mx-auto" />
        <BrandedSkeleton className="h-4 w-1/2 mx-auto mt-1" variant="text" />
        <BrandedSkeleton className="h-4 w-24 mx-auto mt-2" variant="text" />

        {/* Gradient-bordered image */}
        <BrandedSkeleton
          className="mt-4 w-full h-[clamp(72px,20vw,96px)] rounded-2xl"
          withGradientRing
        />

        {/* Category + RSVP */}
        <div className="flex justify-between items-start w-full mt-3">
          <BrandedSkeleton className="h-9 w-24 rounded-lg" />
          <Stack gap="none" className="items-end">
            <BrandedSkeleton className="h-8 w-12" />
            <BrandedSkeleton className="h-4 w-14 mt-1" variant="text" />
          </Stack>
        </div>

        {/* Description lines */}
        <Stack gap="xs" className="mt-4">
          <BrandedSkeleton className="h-4 w-full" variant="text" />
          <BrandedSkeleton className="h-4 w-5/6 mx-auto" variant="text" />
          <BrandedSkeleton className="h-4 w-4/5 mx-auto" variant="text" />
          <BrandedSkeleton className="h-4 w-3/4 mx-auto" variant="text" />
        </Stack>
      </Stack>

      {/* Past Events heading */}
      <Stack gap="xs" className="mb-6 items-center">
        <BrandedSkeleton className="h-8 w-44" />
        <BrandedSkeleton className="h-5 w-64 mt-1" variant="text" />
      </Stack>

      {/* Planet carousel */}
      <div className="flex items-start justify-center gap-4 mt-4">
        <BrandedSkeleton className="h-15 w-15 rounded-full shrink-0 mt-[270px]" />
        <div className="relative mt-15 mx-auto flex-1 flex justify-center">
          <BrandedSkeleton
            className="rounded-full"
            style={{ width: 270, height: 270 }}
          />
        </div>
        <BrandedSkeleton className="h-15 w-15 rounded-full shrink-0 mt-[270px]" />
      </div>

      {/* Text + button beneath planet */}
      <div className="flex flex-col items-center w-full mt-10 gap-3">
        <BrandedSkeleton className="h-4 w-28" variant="text" />
        <BrandedSkeleton className="h-6 w-48" />
        <BrandedSkeleton className="h-12 w-38 rounded-lg mt-10" variant="button" />
      </div>
    </div>
  );
}

export function CommunityShowcaseSkeleton() {
  return (
    <div className="relative overflow-hidden pt-32 md:pt-48 pb-16 md:pb-28 px-4 md:px-8 lg:px-16">
      <div className="relative mx-auto w-full max-w-7xl">
        <MobileShowcaseSkeleton />
        <DesktopShowcaseSkeleton />
      </div>
    </div>
  );
}
