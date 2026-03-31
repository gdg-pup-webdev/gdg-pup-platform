import { Stack, Text } from "@packages/spark-ui";
import { StudyJamContainer } from "../StudyJamContainer";
import { useListEvents } from "@/features/events/hooks/useListEvents";


const TEAM_SLUG_TO_TEAM_NAME_MAP = {
  "cloud-solutions": "Cloud Solutions",
  cybersecurity: "Cybersecurity",
  "data-ml": "Data/ML",
  executives: "Executives",
  iot: "IoT",
  "project-management": "Project Management",
  "ui-ux": "UI/UX",
  "web-development": "Web Development",
};

export function StudyJamsGrid({ teamSlug }: { teamSlug: string }) {
  const { data, error, isLoading } = useListEvents(1, 10, {
    type: "Study Jam",
    teamName:
      TEAM_SLUG_TO_TEAM_NAME_MAP[
        teamSlug as keyof typeof TEAM_SLUG_TO_TEAM_NAME_MAP
      ],
  });

  console.log("study jams loaded", { data, error, isLoading });

  return (
    <Stack gap="xl" className="mt-16">
      <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
      >
        STUDY JAMS
      </Text>

      <div className="w-full flex flex-col md:flex-row flex-wrap gap-6 items-center md:items-stretch justify-center">
        {data &&
          data.data.map((studyjam, index) => (
            <StudyJamContainer
              key={index}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[340px]"
              imageSrc={
                studyjam.image_url || "/products/iot_study_jam_image.jpg"
              }
              imageAlt={`Study Jam ${studyjam.title}`}
              title={studyjam.title || "Study Jam"}
              subtitle={
                studyjam.speakers
                  ? `Featuring ${studyjam.speakers.join(", ")}`
                  : "Study Jam"
              }
              description={
                studyjam.description.slice(0, 200) +
                (studyjam.description.length > 200 ? "..." : "")||
                "Join us for an engaging Study Jam where we dive deep into the latest trends and technologies in the industry. Whether you're a beginner or an expert, there's something for everyone to learn and explore."
              }
              category={
                <>
                  {studyjam.tags &&
                    studyjam.tags.map((tag, index) => (
                      <span className="inline-flex items-center rounded-full bg-[#8B2F00]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                        {tag}
                      </span>
                    ))}
                  {/* <span className="inline-flex items-center rounded-full bg-[#B67853]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  Prototype
                </span>
                <span className="inline-flex items-center rounded-full bg-[#7E6A63]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  3D Models
                </span> */}
                </>
              }
              date={new Date(studyjam.start_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            />
          ))}
      </div>
    </Stack>
  );
}
