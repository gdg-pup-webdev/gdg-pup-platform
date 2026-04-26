import { Stack, Text } from "@packages/spark-ui";
import { StudyJamContainer } from "../StudyJamContainer";
import { useListEvents } from "@/features/events/hooks/useListEvents";
import { normalizeEventDescription } from "@/features/events/utils/description";
import { ASSETS } from "@/lib/constants/assets";
import {
  StudyJamCardsLoading,
  TEAM_SECTION_CARD_CLASSNAME,
} from "./StudyJamCardsLoading";
import { useRouter } from "next/navigation";

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

const FALLBACK_DESCRIPTION =
  "Join us for an engaging Study Jam where we dive deep into the latest trends and technologies in the industry. Whether you're a beginner or an expert, there's something for everyone to learn and explore.";

function getDescriptionPreview(description?: string | null) {
  const normalizedDescription = normalizeEventDescription(description);

  if (!normalizedDescription) {
    return FALLBACK_DESCRIPTION;
  }

  return normalizedDescription.length > 200
    ? `${normalizedDescription.slice(0, 200).trimEnd()}...`
    : normalizedDescription;
}

export function StudyJamsGrid({ teamSlug }: { teamSlug: string }) {
  const { data, isLoading } = useListEvents(1, 10, {
    type: "Study Jam",
    teamName:
      TEAM_SLUG_TO_TEAM_NAME_MAP[
        teamSlug as keyof typeof TEAM_SLUG_TO_TEAM_NAME_MAP
      ],
  });

  const router = useRouter();

  return (
    <Stack gap="xl" className="mt-16">
      <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
        className="text-3xl leading-none sm:text-4xl md:text-5xl"
      >
        STUDY JAMS
      </Text>

      <div className="w-full flex flex-col md:flex-row flex-wrap gap-6 items-center md:items-stretch justify-center">
        {isLoading ? (
          <StudyJamCardsLoading />
        ) : (
          data &&
          data.data.map((studyjam, index) => (
            <StudyJamContainer
              key={index}
              className={`${TEAM_SECTION_CARD_CLASSNAME} hover:cursor-pointer`}
              imageSrc={
                studyjam.image_url || studyjam.images?.[0] || ASSETS.PRODUCTS.STUDY_JAM_PLACEHOLDER
              }
              imageAlt={`Study Jam ${studyjam.title}`}
              title={studyjam.title || "Study Jam"}
              subtitle={
                studyjam.speakers
                  ? `Featuring ${studyjam.speakers.join(", ")}`
                  : "Study Jam"
              }
              description={getDescriptionPreview(studyjam.description)}
              onClick={() => {router.push(`/events/${studyjam.id}`)}}
              category={
                <>
                  {studyjam.tags &&
                    studyjam.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center rounded-full bg-[#EA4335]/90 px-3 py-1 text-[11px] font-medium leading-none text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  {studyjam.tags && studyjam.tags.length > 2 && (
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium leading-none text-white">
                      +{studyjam.tags.length - 2}
                    </span>
                  )}
                  {/* <span className="inline-flex items-center rounded-full bg-[#B67853]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  Prototype
                </span>
                <span className="inline-flex items-center rounded-full bg-[#7E6A63]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  3D Models
                </span> */}
                </>
              }
              date={new Date(studyjam.start_date).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              )}
            />
          ))
        )}
      </div>
    </Stack>
  );
}
