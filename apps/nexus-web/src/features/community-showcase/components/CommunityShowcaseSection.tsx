/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Stack, Text, Card, Button } from "@packages/spark-ui";
const pastEvents = [
  {
    date: "Feb 27, 2026",
    title: "Love at First Prototype: UI/UX in Motion",
    image: "/community-showcase/community-showcase-carousel-1.webp",
  },
  {
    date: "Feb 27, 2026",
    title: "Blue Team 1 Host & Network Hardening",
    image: "/community-showcase/community-showcase-carousel-2.webp",
  },
  {
    date: "Feb 27, 2026",
    title: "Design Smarter, Prototype Faster: Fusion 360 for IoT Innovators",
    image: "/community-showcase/community-showcase-carousel-3.webp",
  },
  {
    date: "Feb 25, 2026",
    title: "Webverse Vol.3: React Basics and Tailwind",
    image: "/community-showcase/community-showcase-carousel-4.webp",
  },
  {
    date: "Feb 22, 2026",
    title: "Cloud Architect 101: Designing a Scalable Ticketing System",
    image: "/community-showcase/community-showcase-carousel-5.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-6.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-7.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-8.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-9.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-10.webp",
  },
];
const pastEventsCarousel = [...pastEvents, ...pastEvents, ...pastEvents];
const pastEventsCardsPerStep = 3;
const pastEventsAutoScrollDelay = 3200;
const pastEventPlanetMaskStyle = {
  WebkitMaskImage:
    "radial-gradient(ellipse 50% 50% at 50% 50%, black 50%, rgba(0, 0, 0, 0.35) 85%, rgba(0, 0, 0, 0) 100%)",
  maskImage:
    "radial-gradient(ellipse 50% 50% at 50% 50%, black 50%, rgba(0, 0, 0, 0.35) 85%, rgba(0, 0, 0, 0) 100%)",
};
const pastEventPlanetFrameStyle = {
  background:
    "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.98) 0%, rgba(220, 226, 235, 0.96) 26%, rgba(86, 92, 108, 0.94) 58%, rgba(9, 11, 18, 1) 100%)",
};
function CarouselArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <span className="text-xl font-extrabold leading-none">
      {direction === "left" ? "←" : "→"}
    </span>
  );
}
export function CommunityShowcaseSection() {
  const [isEventCardHovered, setIsEventCardHovered] = useState(false);
  const [isPastEventsHovered, setIsPastEventsHovered] = useState(false);
  const [isPastEventsDragging, setIsPastEventsDragging] = useState(false);
  const [mobileEventIndex, setMobileEventIndex] = useState(0);
  const [mobileCarouselScale, setMobileCarouselScale] = useState(1);
  const [is39Hovered, setIs39Hovered] = useState(false);
  const [isDesktopEventModalOpen, setIsDesktopEventModalOpen] = useState(false);
  const [shouldRenderDesktopEventModal, setShouldRenderDesktopEventModal] =
    useState(false);
  const [isDesktopEventModalVisible, setIsDesktopEventModalVisible] =
    useState(false);

  useEffect(() => {
    if (isDesktopEventModalOpen) {
      setShouldRenderDesktopEventModal(true);

      let raf1 = 0;
      let raf2 = 0;

      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setIsDesktopEventModalVisible(true);
        });
      });

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    setIsDesktopEventModalVisible(false);

    const timeout = setTimeout(() => {
      setShouldRenderDesktopEventModal(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [isDesktopEventModalOpen]);

  useEffect(() => {
    const REFERENCE_WIDTH = 422;
    const SECTION_PADDING = 32;
    const update = () => {
      const available = window.innerWidth - SECTION_PADDING;
      setMobileCarouselScale(Math.min(1, available / REFERENCE_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const clickAnimRef = useRef<number | null>(null);

  const applyOffset = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
    }
  }, []);

  const normalizeOffset = useCallback(() => {
    const sw = setWidthRef.current;
    if (!sw) return;
    if (offsetRef.current < sw * 0.5) offsetRef.current += sw;
    else if (offsetRef.current > sw * 1.5) offsetRef.current -= sw;
  }, []);

  const getCardSpan = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const cards = track.querySelectorAll<HTMLElement>("[data-past-event-card]");
    if (cards.length < 2) return cards[0]?.offsetWidth ?? 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }, []);

  useEffect(() => {
    const init = () => {
      const span = getCardSpan();
      if (!span) return false;
      const sw = span * pastEvents.length;
      setWidthRef.current = sw;
      if (offsetRef.current < sw * 0.1) {
        offsetRef.current = sw;
        applyOffset();
      }
      return true;
    };

    if (init()) return;
    const observer = new ResizeObserver(() => {
      if (init()) observer.disconnect();
    });
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [getCardSpan, applyOffset]);

  useEffect(() => {
    if (isPastEventsHovered || isPastEventsDragging) return;

    let rafId = 0;
    let lastTime = 0;
    const PX_PER_SEC = 100;

    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      offsetRef.current += (PX_PER_SEC * delta) / 1000;
      normalizeOffset();
      applyOffset();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPastEventsHovered, isPastEventsDragging, applyOffset, normalizeOffset]);

  const animateScrollBy = useCallback(
    (delta: number) => {
      if (clickAnimRef.current != null) {
        cancelAnimationFrame(clickAnimRef.current);
      }
      const start = offsetRef.current;
      const target = start + delta;
      const DURATION = 420; // ms
      let startTime: number | null = null;

      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        offsetRef.current = start + delta * easeInOut(progress);
        normalizeOffset();
        applyOffset();
        if (progress < 1) {
          clickAnimRef.current = requestAnimationFrame(tick);
        } else {
          clickAnimRef.current = null;
        }
      };

      clickAnimRef.current = requestAnimationFrame(tick);
    },
    [applyOffset, normalizeOffset],
  );

  const handlePrev = useCallback(() => {
    const span = getCardSpan();
    if (span) animateScrollBy(-span * pastEventsCardsPerStep);
  }, [getCardSpan, animateScrollBy]);

  const handleNext = useCallback(() => {
    const span = getCardSpan();
    if (span) animateScrollBy(span * pastEventsCardsPerStep);
  }, [getCardSpan, animateScrollBy]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("button"))
      return;
    // Cancel any in-progress click animation
    if (clickAnimRef.current != null) {
      cancelAnimationFrame(clickAnimRef.current);
      clickAnimRef.current = null;
    }
    setIsPastEventsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPastEventsDragging) return;
    const dx = event.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current - dx;
    normalizeOffset();
    applyOffset();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPastEventsDragging) return;
    setIsPastEventsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    normalizeOffset();
    applyOffset();
  };

  return (
    <div className="relative overflow-hidden pt-32 pb-32 md:pt-60 md:pb-48 px-4 md:px-8 lg:px-16">
      {/* ===================== DESKTOP BACKGROUND (hidden on mobile) ===================== */}
      <div className="hidden md:block">
        {/* Decorative blob - top right */}
        <div className="w-[802px] h-[811px] right-0 top-0 absolute bg-pink-400/30 rounded-full blur-[400px] translate-x-1/2 -translate-y-1/2"></div>
        {/* Decorative blob - left */}
        <div className="w-[802px] h-[811px] left-0 top-0 absolute bg-blue-500/25 rounded-full blur-[400px] -translate-x-1/2 translate-y-1/2"></div>
        <div className="w-[966px] h-[977px] left-0 top-0 absolute bg-sky-400/20 rounded-full blur-[400px] -translate-x-1/5 translate-y-3/4"></div>
        {/* Decorative blob - bottom */}
        <div className="w-[966px] h-[977px] left-0 bottom-0 absolute bg-pink-400/30 rounded-full blur-[400px] translate-x-1/2 translate-y-4/20"></div>
        {/* Cirby - right */}
        <img
          className="w-[30vw] max-w-[493px] h-auto right-0 top-55 absolute -mr-[6vw]"
          src="/community-showcase/community-showcase-cirby.webp"
          alt=""
        />
        {/* Stardust left */}
        <img
          className="w-[1354.15px] h-[1656.86px] left-0 top-0 absolute opacity-75 -ml-165 mt-40"
          src="/community-showcase/community-showcase-space-dust-1.webp"
          alt=""
        />
        {/* Stardust right */}
        <img
          className="w-[1400px] h-auto right-20 bottom-235 absolute opacity-75 translate-x-1/3"
          src="/community-showcase/community-showcase-space-dust-2.webp"
          alt=""
        />
      </div>
      {/* ===================== END DESKTOP BACKGROUND ===================== */}
      {/* ===================== MOBILE LAYOUT ===================== */}
      <div className="md:hidden relative z-10">
        {/* ===================== MOBILE BACKGROUND ===================== */}
        {/* Decorative blob - top right */}
        <div className="w-[454px] h-[459px] right-0 top-0 absolute bg-pink-400/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>
        {/* Decorative blob - top left */}
        <div className="w-[454px] h-[459px] left-0 top-0 absolute bg-sky-400/25 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2"></div>
        {/* Decorative blob - bottom left */}
        <div className="w-[454px] h-[459px] left-0 bottom-0 absolute bg-sky-400/25 rounded-full blur-[150px] translate-y-4/5"></div>
        {/* Stardust left */}
        <img
          className="w-96 h-auto left-0 top-0 absolute opacity-75 rotate-10 -ml-60 -mt-6"
          src="/community-showcase/community-showcase-space-dust-1.webp"
          alt=""
        />
        {/* Cirby - right */}
        <img
          className="w-[33vw] max-w-[493px] h-auto right-0 top-2 absolute -mr-[11vw] -z-10"
          src="/community-showcase/community-showcase-cirby.webp"
          alt=""
        />
        {/* Stardust right */}
        <img
          className="w-[900px] max-w-none h-auto right-12 -bottom-20 absolute opacity-75 translate-x-1/2"
          src="/community-showcase/community-showcase-space-dust-2.webp"
          alt=""
        />
        {/* ===================== END MOBILE BACKGROUND ===================== */}
        <Stack gap="md" className="items-center mb-12">
          <Text
            variant="heading-4"
            gradient="white-blue"
            align="center"
            weight="bold"
            className="z-20"
          >
            Community Showcase
          </Text>
          <Text
            as="h2"
            variant="body"
            weight="bold"
            align="center"
            className="text-white"
          >
            Discover what our community has been <br /> building together.
          </Text>
        </Stack>

        {/* Mobile: Featured event card */}
        <Stack gap="xs" className="mb-10">
          <Text
            variant="heading-5"
            gradient="white-green"
            align="center"
            weight="bold"
            className="z-20"
          >
            Love at First Prototype: UI/UX in Motion
          </Text>
          <Text variant="body" align="center" color="on-secondary">
            MS Teams &nbsp; • &nbsp; Feb 27, 2026, 8:00 PM - 9:30 PM
          </Text>
          <img
            className="w-120 h-auto max-w-none left-1/2 -translate-x-1/2 top-32 absolute -z-10"
            src="/community-showcase/community-showcase-horizon.webp"
            alt=""
          />
          <Text
            variant="body"
            align="center"
            color="on-secondary"
            className="mt-2"
            weight="semibold"
          >
            Today&apos;s Highlight
          </Text>
          <div className="mt-4 w-full rounded-2xl overflow-hidden shadow-[0px_10px_15px_0px_rgba(0,0,0,0.40)] p-[2px] bg-[linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)]">
            <img
              src="/community-showcase/community-showcase-event.webp"
              alt="Featured event"
              className="w-full h-[clamp(72px,20vw,96px)] object-cover rounded-[14px]"
            />
          </div>
          <div className="flex justify-between items-start w-full mt-3">
            {/* Left: UI/UX */}
            <div
              data-property-1="Default"
              className="h-9 px-3 py-1 rounded-lg outline outline-[1.50px] outline-offset-[-1.50px] outline-white flex items-center"
            >
              <Text variant="body" color="on-secondary" className="z-10">
                UI / UX Designs
              </Text>
            </div>

            {/* Right: number + label */}
            <div className="flex flex-col items-end mt-0">
              <Text variant="heading-4" className="text-white">
                39
              </Text>
              <Text variant="body" className="text-white leading-5">
                RSVP&apos;d
              </Text>
            </div>
          </div>

          <Text
            variant="body"
            className="text-white mt-4 leading-7 self-stretch text-center justify-start"
          >
            Join us for an empowering session on February 27, 2026, from 8:00 PM
            to 9:30 PM, as we delve into the world of intermediate UI/UX design!
            In the "Interactive UI/UX Design Bootcamp," we'll transform your
            ideas into reality by guiding you through the creation of both low-
            and high-fidelity wireframes. Learn how to turn these wireframes
            into interactive prototypes to showcase real user flows. We'll
            introduce key Figma features like Auto Layout and Components that
            boost design efficiency and maintain consistency. To top it all off,
            engage in our "Hero Maker: Proto-Design Challenge," a mini design
            task where you can apply what you've learned. Become part of the
            design revolution and elevate your skills with GDG PUP! Don’t miss
            this opportunity to enhance your design capabilities. Book your seat
            today and bring your vision to life!
          </Text>
        </Stack>

        {/* Mobile: Past Events list */}
        <Stack gap="xs" className="mb-6">
          <Text
            variant="heading-3"
            gradient="white-blue"
            align="center"
            weight="bold"
          >
            Past Events
          </Text>
          <Text
            variant="body-lg"
            weight="semibold"
            align="center"
            color="on-secondary"
          >
            Look back on the great things we&apos;ve accomplished.
          </Text>
        </Stack>
        {/* Mobile: single-card carousel */}
        <div
          className="flex items-start justify-center gap-4 mt-4 origin-[top_center]"
          style={{
            transform: `scale(${mobileCarouselScale})`,
            marginBottom: `${330 * (mobileCarouselScale - 1)}px`,
          }}
        >
          {/* Prev button */}
          <Button
            variant="colored"
            subVariant="blue"
            aria-label="Previous event"
            className="h-15 w-15 shrink-0 rounded-full mt-[270px]"
            onClick={() =>
              setMobileEventIndex((i) =>
                i === 0 ? pastEvents.length - 1 : i - 1,
              )
            }
          >
            <CarouselArrowIcon direction="left" />
          </Button>

          {/* Planet only */}
          <div className="relative mt-15 mx-auto flex-1 flex justify-center">
            <div className="relative" style={{ width: 270, height: 270 }}>
              <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
                <img
                  src={pastEvents[mobileEventIndex].image}
                  alt={pastEvents[mobileEventIndex].title}
                  className="h-full w-full object-cover"
                  style={pastEventPlanetMaskStyle}
                />
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_-40%_60%,rgba(0,0,0,0.72)_0%,transparent_65%)]"></div>
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_110%_22%,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.28)_28%,transparent_70%)]"></div>
              </div>
              <img
                src="/community-showcase/community-showcase-rings.webp"
                alt=""
                draggable={false}
                className="pointer-events-none absolute left-1/2 top-1/2 w-[154%] max-w-none -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* Next button */}
          <Button
            variant="colored"
            subVariant="blue"
            aria-label="Next event"
            className="h-15 w-15 shrink-0 rounded-full mt-[270px]"
            onClick={() =>
              setMobileEventIndex((i) =>
                i === pastEvents.length - 1 ? 0 : i + 1,
              )
            }
          >
            <CarouselArrowIcon direction="right" />
          </Button>
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center w-full mt-10">
          <Text variant="body" align="center" color="muted" className="text-xl">
            {pastEvents[mobileEventIndex].date}
          </Text>
          <Text
            variant="heading-6"
            align="center"
            color="on-secondary"
            className="mt-1 w-full"
          >
            {pastEvents[mobileEventIndex].title}
          </Text>
          <Button
            variant="colored"
            subVariant="blue"
            className="mt-10 h-12 w-38 rounded-lg text-xl font-medium"
          >
            Learn more
          </Button>
        </div>
      </div>
      {/* ===================== END MOBILE LAYOUT ===================== */}
      {/* ===================== DESKTOP LAYOUT ===================== */}
      <Container>
        <Stack gap="2xl" className="hidden md:flex relative z-10 gap-32">
          {/* Page Heading */}
          <Stack gap="md" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
              className="z-20"
            >
              Community Showcase
            </Text>
            <Text
              as="h2"
              variant="heading-4"
              weight="bold"
              align="center"
              className="text-white z-10"
            >
              Discover what our community has been building together.
            </Text>
          </Stack>
          <img
            className="w-[min(1700px,140vw)] h-auto max-w-none left-1/2 -translate-x-1/2 -top-30 absolute"
            src="/community-showcase/community-showcase-horizon.webp"
            alt=""
          />
          {/* Featured Event */}
          <Stack gap="xs" className="mt-12">
            <Stack
              gap="xs"
              className={`z-10 transition-transform duration-1000 ease-out ${isEventCardHovered ? "-translate-y-14" : "translate-y-0"}`}
            >
              <Text
                variant="heading-2"
                gradient="white-green"
                align="center"
                weight="bold"
                className="z-10"
              >
                Love at First Prototype: UI/UX in Motion
              </Text>
              <Text
                variant="body-lg"
                align="center"
                color="on-secondary"
                className="z-10"
              >
                MS Teams &nbsp; • &nbsp; Feb 27, 2026, 8:00 PM - 9:30 PM
              </Text>
              <Text
                variant="body"
                align="center"
                color="on-secondary"
                className="mt-4 z-10"
              >
                Today&apos;s Highlight
              </Text>
            </Stack>
            {/* Sample event card */}
            <div className="relative left-1/2 mt-15 flex w-[calc(100vw-2rem)] max-w-[1450px] -translate-x-1/2 justify-center z-10">
              <Card
                variant="default"
                className="w-full h-[clamp(200px,25vw,360px)] rounded-[32px] max-w-none p-1 bg-[linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.40)] overflow-hidden !bg-transparent !border-0 z-10 transform transition-transform duration-1000 ease-out hover:rotate-[-3.95deg]"
                onMouseEnter={() => setIsEventCardHovered(true)}
                onMouseLeave={() => setIsEventCardHovered(false)}
              >
                <img
                  src="/community-showcase/community-showcase-event.webp"
                  alt=""
                  className="w-full h-full object-cover rounded-[30px]"
                />
              </Card>
            </div>
            {/* About + Stats row */}
            <div
              className={`relative left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[1450px] flex justify-center mt-10 z-10 transition-transform duration-1000 ease-out ${isEventCardHovered ? "translate-y-14" : "translate-y-0"}`}
            >
              <div className="w-full flex flex-col md:flex-row gap-8">
                {/* About */}
                <Stack gap="sm" className="flex-[2]">
                  <button
                    type="button"
                    onClick={() => setIsDesktopEventModalOpen(true)}
                    className="text-left cursor-pointer group"
                  >
                    <Text
                      variant="body-lg"
                      className="text-white transition-colors duration-200 group-hover:text-blue-500"
                    >
                      ABOUT THIS EVENT
                    </Text>
                    <Text
                      variant="body"
                      className="text-white leading-8 max-w-[55vw] xl:max-w-220 transition-colors duration-200 group-hover:text-blue-500"
                    >
                      {(() => {
                        const text = `Join us for an empowering session on February 27, 2026, from 8:00 PM to 9:30 PM, as we delve into the world of intermediate UI/UX design! In the "Interactive UI/UX Design Bootcamp," we'll transform your ideas into reality by guiding you through the creation of both low- and high-fidelity wireframes. Learn how to turn these wireframes into interactive prototypes to showcase real user flows. We'll introduce key Figma features like Auto Layout and Components that boost design efficiency and maintain consistency. To top it all off, engage in our "Hero Maker: Proto-Design Challenge," a mini design task where you can apply what you've learned. Become part of the design revolution and elevate your skills with GDG PUP! Don't miss this opportunity to enhance your design capabilities. Book your seat today and bring your vision to life!`;
                        return text.length > 493
                          ? text.slice(0, 493) + "..."
                          : text;
                      })()}
                    </Text>
                  </button>
                </Stack>
                {/* Divider */}
                <div className="hidden md:block w-[2px] bg-white"></div>
                {/* Stats */}
                <Stack
                  gap="none"
                  className="flex-1 items-end text-right h-full justify-between"
                >
                  {/* Top content */}
                  <div>
                    <div
                      onMouseEnter={() => setIs39Hovered(true)}
                      onMouseLeave={() => setIs39Hovered(false)}
                      style={{
                        display: "inline-block",
                        transform: is39Hovered
                          ? "rotate(-15.95deg)"
                          : "rotate(0deg)",
                        transition: "transform 1000ms ease-out",
                      }}
                    >
                      <Text
                        variant="heading-2"
                        className={is39Hovered ? "" : "text-white"}
                        gradient={is39Hovered ? "white-blue" : undefined}
                      >
                        39
                      </Text>
                    </div>
                    <div
                      style={{
                        transform: is39Hovered
                          ? "translateY(20px)"
                          : "translateY(0)",
                        transition: "transform 1000ms ease-out",
                      }}
                    >
                      <Text
                        variant="body"
                        className="text-white leading-8 max-w-[600px]"
                      >
                        RSVP&apos;d
                      </Text>
                    </div>
                  </div>
                  {/* Bottom content */}
                  <div
                    data-property-1="Default"
                    className="h-9 max-w-72 px-3 py-1 rounded-2xl outline outline-[1.50px] outline-offset-[-1.50px] outline-white inline-flex flex-col justify-center items-center gap-2"
                  >
                    <Text variant="body" color="on-secondary">
                      UI / UX Designs
                    </Text>
                  </div>
                </Stack>
              </div>
            </div>
          </Stack>
          {/* 2nd Event */}
          <Stack gap="xs" className="mt-22">
            <Stack
              gap="xs"
              className={`z-10 transition-transform duration-1000 ease-out ${isEventCardHovered ? "-translate-y-14" : "translate-y-0"}`}
            >
              <Text
                variant="heading-2"
                gradient="white-green"
                align="center"
                weight="bold"
                className="z-10"
              >
                Love at First Prototype: UI/UX in Motion
              </Text>
              <Text
                variant="body-lg"
                align="center"
                color="on-secondary"
                className="z-10"
              >
                MS Teams &nbsp; • &nbsp; Feb 27, 2026, 8:00 PM - 9:30 PM
              </Text>
              <Text
                variant="body"
                align="center"
                color="on-secondary"
                className="mt-4 z-10"
              >
                Today&apos;s Highlight
              </Text>
            </Stack>
            {/* Sample event card */}
            <div className="relative left-1/2 mt-15 flex w-[calc(100vw-2rem)] max-w-[1450px] -translate-x-1/2 justify-center z-10">
              <Card
                variant="default"
                className="w-full h-[clamp(200px,25vw,360px)] rounded-[32px] max-w-none p-1 bg-[linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.40)] overflow-hidden !bg-transparent !border-0 z-10 transform transition-transform duration-1000 ease-out hover:rotate-[-3.95deg]"
                onMouseEnter={() => setIsEventCardHovered(true)}
                onMouseLeave={() => setIsEventCardHovered(false)}
              >
                <img
                  src="/community-showcase/community-showcase-event.webp"
                  alt=""
                  className="w-full h-full object-cover rounded-[30px]"
                />
              </Card>
            </div>
            {/* About + Stats row */}
            <div
              className={`relative left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[1450px] flex justify-center mt-10 z-10 transition-transform duration-1000 ease-out ${isEventCardHovered ? "translate-y-14" : "translate-y-0"}`}
            >
              <div className="w-full flex flex-col md:flex-row gap-8">
                {/* About */}
                <Stack gap="sm" className="flex-[2]">
                  <button
                    type="button"
                    onClick={() => setIsDesktopEventModalOpen(true)}
                    className="text-left cursor-pointer group"
                  >
                    <Text
                      variant="body-lg"
                      className="text-white transition-colors duration-200 group-hover:text-blue-500"
                    >
                      ABOUT THIS EVENT
                    </Text>
                    <Text
                      variant="body"
                      className="text-white leading-8 max-w-[55vw] xl:max-w-220 transition-colors duration-200 group-hover:text-blue-500"
                    >
                      {(() => {
                        const text = `Join us for an empowering session on February 27, 2026, from 8:00 PM to 9:30 PM, as we delve into the world of intermediate UI/UX design! In the "Interactive UI/UX Design Bootcamp," we'll transform your ideas into reality by guiding you through the creation of both low- and high-fidelity wireframes. Learn how to turn these wireframes into interactive prototypes to showcase real user flows. We'll introduce key Figma features like Auto Layout and Components that boost design efficiency and maintain consistency. To top it all off, engage in our "Hero Maker: Proto-Design Challenge," a mini design task where you can apply what you've learned. Become part of the design revolution and elevate your skills with GDG PUP! Don't miss this opportunity to enhance your design capabilities. Book your seat today and bring your vision to life!`;
                        return text.length > 493
                          ? text.slice(0, 493) + "..."
                          : text;
                      })()}
                    </Text>
                  </button>
                </Stack>
                {/* Divider */}
                <div className="hidden md:block w-[2px] bg-white"></div>
                {/* Stats */}
                <Stack
                  gap="none"
                  className="flex-1 items-end text-right h-full justify-between"
                >
                  {/* Top content */}
                  <div>
                    <div
                      onMouseEnter={() => setIs39Hovered(true)}
                      onMouseLeave={() => setIs39Hovered(false)}
                      style={{
                        display: "inline-block",
                        transform: is39Hovered
                          ? "rotate(-15.95deg)"
                          : "rotate(0deg)",
                        transition: "transform 1000ms ease-out",
                      }}
                    >
                      <Text
                        variant="heading-2"
                        className={is39Hovered ? "" : "text-white"}
                        gradient={is39Hovered ? "white-blue" : undefined}
                      >
                        39
                      </Text>
                    </div>
                    <div
                      style={{
                        transform: is39Hovered
                          ? "translateY(20px)"
                          : "translateY(0)",
                        transition: "transform 1000ms ease-out",
                      }}
                    >
                      <Text
                        variant="body"
                        className="text-white leading-8 max-w-[600px]"
                      >
                        RSVP&apos;d
                      </Text>
                    </div>
                  </div>
                  {/* Bottom content */}
                  <div
                    data-property-1="Default"
                    className="h-9 max-w-72 px-3 py-1 rounded-2xl outline outline-[1.50px] outline-offset-[-1.50px] outline-white inline-flex flex-col justify-center items-center gap-2"
                  >
                    <Text variant="body" color="on-secondary">
                      UI / UX Designs
                    </Text>
                  </div>
                </Stack>
              </div>
            </div>
          </Stack>
          {/* Past Events */}
          <Stack gap="xs" className="mt-22">
            <Stack gap="xs" className="z-10">
              <Text
                variant="heading-2"
                gradient="white-blue"
                align="center"
                weight="bold"
                className="z-10"
              >
                Past Events
              </Text>
              <Text
                variant="body-lg"
                align="center"
                color="on-secondary"
                className="z-10"
              >
                Look back on the great things we&apos;ve accomplished.
              </Text>
              <div
                className="relative mt-10 flex items-center justify-center gap-4 lg:gap-10 xl:gap-20"
                onMouseEnter={() => setIsPastEventsHovered(true)}
                onMouseLeave={() => setIsPastEventsHovered(false)}
              >
                <Button
                  variant="colored"
                  subVariant="blue"
                  aria-label="Scroll past events left by three cards"
                  className="h-15 w-15 shrink-0 rounded-full"
                  onClick={handlePrev}
                >
                  <CarouselArrowIcon direction="left" />
                </Button>
                <div className="relative flex w-[calc(100vw-12rem)] max-w-[1300px] justify-center z-10">
                  <div className="relative w-full overflow-hidden">
                    <div
                      className={`flex gap-8 md:gap-12 lg:gap-28 xl:gap-40 2xl:gap-35 pb-6 pt-4 w-max ${isPastEventsDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
                      ref={trackRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                    >
                      {pastEventsCarousel.map((event, index) => (
                        <Stack
                          key={`${event.title}-${index}`}
                          data-past-event-card
                          gap="none"
                          justify="between"
                          className="h-full shrink-0 self-stretch items-center w-[clamp(180px,16vw,320px)]"
                        >
                          <div className="flex w-full flex-col items-center">
                            <div
                              className="relative"
                              style={{
                                width: "clamp(140px,14vw,260px)",
                                height: "clamp(140px,14vw,260px)",
                              }}
                            >
                              <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  draggable={false}
                                  className="h-full w-full object-cover"
                                  style={pastEventPlanetMaskStyle}
                                />
                                {/* Dark shadow bottom-left */}
                                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_-40%_60%,rgba(0,0,0,0.72)_0%,transparent_65%)]"></div>
                                {/* White specular highlight top-right */}
                                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_110%_22%,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.28)_28%,transparent_70%)]"></div>
                              </div>
                              <img
                                src="/community-showcase/community-showcase-rings.webp"
                                alt=""
                                draggable={false}
                                className="pointer-events-none absolute left-1/2 top-1/2 w-[154%] max-w-none -translate-x-1/2 -translate-y-1/2"
                              />
                            </div>
                            <Text
                              variant="body"
                              align="center"
                              color="muted"
                              className="mt-5 xl:mt-7"
                            >
                              {event.date}
                            </Text>
                            <Text
                              variant="body"
                              align="center"
                              color="on-secondary"
                              className="mt-2 max-w-[280px] xl:max-w-[320px]"
                            >
                              {event.title}
                            </Text>
                          </div>
                          <Button
                            variant="colored"
                            subVariant="blue"
                            className="mt-5 xl:mt-7 h-10 xl:h-13 min-w-[8.5rem] shrink-0 whitespace-nowrap rounded-lg px-4 xl:min-w-[9rem]"
                          >
                            Learn more
                          </Button>
                        </Stack>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="colored"
                  subVariant="blue"
                  aria-label="Scroll past events right by three cards"
                  className="h-15 w-15 shrink-0 rounded-full"
                  onClick={handleNext}
                >
                  <CarouselArrowIcon direction="right" />
                </Button>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </Container>
      {shouldRenderDesktopEventModal && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsDesktopEventModalOpen(false)}
            style={{
              backgroundColor: isDesktopEventModalVisible
                ? "rgba(0,0,0,0.6)"
                : "rgba(0,0,0,0)",
              transition: "background-color 800ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          <div
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none"
            style={{
              transform: isDesktopEventModalVisible
                ? "translateY(0) scale(1)"
                : "translateY(calc(100vh + 120px)) scale(0.98)",
              opacity: isDesktopEventModalVisible ? 1 : 0,
              transition:
                "transform 800ms cubic-bezier(0.22,1,0.36,1), opacity 500ms ease",
              willChange: "transform, opacity",
            }}
          >
            <div
              className="relative w-full max-w-[1100px]  pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient border ring */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  padding: "2px",
                  background:
                    "linear-gradient(135deg, #EA4335, #F9AB00, #34A853, #4285F4)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              {/* Frosted content */}
              <div
                className="relative flex items-center justify-center gap-2.5 rounded-2xl p-9"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(70px) saturate(180%)",
                  WebkitBackdropFilter: "blur(70px) saturate(180%)",
                }}
              >
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setIsDesktopEventModalOpen(false)}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center overflow-hidden"
                >
                  ✕
                </button>

                <div
                  className="flex-1 text-lg leading-7 text-white"
                  style={{
                    opacity: isDesktopEventModalVisible ? 1 : 0,
                    transform: isDesktopEventModalVisible
                      ? "translateY(0)"
                      : "translateY(10px)",
                    transition:
                      "opacity 700ms ease 80ms, transform 800ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  Join us for an empowering session on February 27, 2026, from
                  8:00 PM to 9:30 PM, as we delve into the world of intermediate
                  UI/UX design! In the &quot;Interactive UI/UX Design
                  Bootcamp,&quot; we&apos;ll transform your ideas into reality
                  by guiding you through the creation of both low- and
                  high-fidelity wireframes. Learn how to turn these wireframes
                  into interactive prototypes to showcase real user flows.
                  We&apos;ll introduce key Figma features like Auto Layout and
                  Components that boost design efficiency and maintain
                  consistency. To top it all off, engage in our &quot;Hero
                  Maker: Proto-Design Challenge,&quot; a mini design task where
                  you can apply what you&apos;ve learned. Become part of the
                  design revolution and elevate your skills with GDG PUP!
                  Don&apos;t miss this opportunity to enhance your design
                  capabilities. Book your seat today and bring your vision to
                  life!
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* ===================== END DESKTOP LAYOUT ===================== */}
    </div>
  );
}
