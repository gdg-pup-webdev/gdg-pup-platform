import { Stack, Text } from "@packages/spark-ui";
import { StudyJamContainer } from "../StudyJamContainer";
import { useGetLearningResources } from "@/features/learning-resources/hooks";
import { normalizeEventDescription } from "@/features/events/utils/description";
import { ASSETS } from "@/lib/constants/assets";
import {
  StudyJamCardsLoading,
  TEAM_SECTION_CARD_CLASSNAME,
} from "./StudyJamCardsLoading";

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

export function LearningResourcesGrid({ teamSlug }: { teamSlug: string }) {
  const { data, isLoading } = useGetLearningResources({
    teamName:
      TEAM_SLUG_TO_TEAM_NAME_MAP[
        teamSlug as keyof typeof TEAM_SLUG_TO_TEAM_NAME_MAP
      ],
    pageNumber: 1,
    pageSize: 10,
  });

  return (
    <Stack gap="xl" className="mt-16">
      {
        isLoading &&  <>
        {/* loading rectangle */}
        <div className="w-1/3 h-10 bg-gray-300 rounded animate-pulse mx-auto" />
      </> 
      }

      {
        !isLoading && !data?.data.length && ( (data?.data?.length || -1) > 0) && <> <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
        className="text-3xl leading-none sm:text-4xl md:text-5xl"
      >
        LEARNING RESOURCES
      </Text></>
      }

      <div className="w-full flex flex-col md:flex-row flex-wrap gap-6 items-center md:items-stretch justify-center">
        {isLoading ? (
          <StudyJamCardsLoading />
        ) : (
          data &&
          data.data.map((resource, index) => (
            <StudyJamContainer
              key={index}
              className={`${TEAM_SECTION_CARD_CLASSNAME} hover:cursor-pointer `}
              imageSrc={
                resource.thumbnailUrl || ASSETS.PRODUCTS.STUDY_JAM_PLACEHOLDER
              }
              imageAlt={`Study Jam ${resource.title}`}
              title={resource.title || "Study Jam"}
              subtitle="Learning Resource"
              description={getDescriptionPreview(resource.description)}
              category={
                <>
                  {resource.tags &&
                    resource.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="inline-flex items-center rounded-full bg-[#8B2F00]/90 px-3 py-1 text-[11px] font-medium leading-none text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  {resource.tags && resource.tags.length > 2 && (
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium leading-none text-white">
                      +{resource.tags.length - 2}
                    </span>
                  )}
                </>
              }
              onClick={() => window.open(resource.url, "_blank")}
              date={new Date(resource.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            />
          ))
        )}
      </div>
    </Stack>
  );
}
