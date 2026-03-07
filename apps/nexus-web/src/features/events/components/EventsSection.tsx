import { Container, Stack, Text } from "@packages/spark-ui";
import { EventsCalendar } from "./EventsCalendar";
import { EventsGallery } from "./EventsGallery";

export function EventsSection() {
  return (
    <div
      className="relative overflow-x-hidden pt-36 md:pt-60 pb-14 md:pb-48 px-4 md:px-8 lg:px-16"
      style={{ backgroundColor: "rgba(15, 14, 14, 1)" }}
    >
      {/* Mobile blobs */}
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "220px",
          height: "220px",
          top: "120px",
          left: "-85px",
          background: "rgba(66, 133, 244, 0.54)",
          filter: "blur(90px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "180px",
          height: "180px",
          top: "500px",
          right: "-72px",
          background: "rgba(52, 168, 83, 0.46)",
          filter: "blur(82px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "170px",
          height: "170px",
          top: "860px",
          left: "-68px",
          background: "rgba(234, 67, 53, 0.48)",
          filter: "blur(78px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "165px",
          height: "165px",
          top: "1160px",
          right: "-62px",
          background: "rgba(249, 171, 0, 0.52)",
          filter: "blur(74px)",
          zIndex: 0,
        }}
      />

      {/* Decorative blob - top left */}
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(900px, 65vw)",
          height: "min(800px, 70vh)",
          top: "calc(4rem - 300px)",
          left: "max(calc((100vw - 80rem) / 2), 0px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />
      {/* Decorative blob - right */}
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(800px, 60vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem + 200px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(520px, 40vw)",
          height: "min(520px, 40vw)",
          top: "220px",
          left: "-160px",
          background: "rgba(66, 133, 244, 0.75)",
          filter: "blur(220px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(460px, 34vw)",
          height: "min(460px, 34vw)",
          top: "1300px",
          left: "-150px",
          background: "rgba(234, 67, 53, 0.75)",
          filter: "blur(200px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(340px, 26vw)",
          height: "min(340px, 26vw)",
          top: "220px",
          right: "-100px",
          background: "rgba(52, 168, 83, 0.75)",
          filter: "blur(160px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(320px, 24vw)",
          height: "min(320px, 24vw)",
          top: "790px",
          right: "-100px",
          background: "rgba(249, 171, 0, 0.75)",
          filter: "blur(150px)",
          zIndex: 0,
        }}
      />
      <Container>
        <Stack gap="xl" className="relative z-10 md:gap-2xl">
          {/* Events Calendar */}
          <Stack gap="lg" className="items-center !gap-3 md:!gap-6">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
              className="text-[1.7rem] sm:text-[2.15rem] leading-tight whitespace-nowrap md:text-[3.5rem]"
            >
              EVENTS CALENDAR
            </Text>
            <Text
              variant="body"
              align="center"
              color="secondary"
              className="text-white text-sm md:text-base max-w-[58ch]"
            >
              Upcoming events promoting leadership, collaboration, learning, and
              the shared effort that builds our community. Every entry on this
              calendar is an invitation to add your story to ours.
            </Text>
            <EventsCalendar />
          </Stack>

          {/* Events Gallery */}
          <Stack gap="lg" className="items-center mt-8 md:mt-24 !gap-3 md:!gap-6">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
              className="text-[1.7rem] sm:text-[2.15rem] leading-tight whitespace-nowrap md:text-[3.5rem]"
            >
              EVENTS GALLERY
            </Text>
            <Text
              variant="body"
              align="center"
              color="secondary"
              className="text-white text-sm md:text-base max-w-[58ch]"
            >
              A behind-the-scenes moment from our past events, capturing
              collaboration, learning, and the shared effort that builds our
              community.
            </Text>

            <EventsGallery />
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
