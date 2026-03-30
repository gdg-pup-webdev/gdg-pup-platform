import { Stack, Text } from "@packages/spark-ui";
import { StudyJamContainer } from "../StudyJamContainer";
import { useListEvents } from "@/features/events/hooks/useListEvents"; 
import { useGetLearningResources } from "@/features/learning-resources/hooks";

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

export function LearningResourcesGrid({ teamSlug }: { teamSlug: string }) {
  const { data, error, isLoading } = useGetLearningResources({
    teamName:
      TEAM_SLUG_TO_TEAM_NAME_MAP[
        teamSlug as keyof typeof TEAM_SLUG_TO_TEAM_NAME_MAP
      ],
    pageNumber: 1,
    pageSize: 10,
  });

  console.log("learning resources loaded", { data, error, isLoading });

  return (
    <Stack gap="xl" className="mt-16">
      <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
      >
        LEARNING RESOURCES
      </Text>

      <div className="w-full flex flex-col md:flex-row flex-wrap gap-6 items-center md:items-stretch justify-center">
        {data &&
          data.data.map((resource, index) => (
            <StudyJamContainer
              key={index}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[340px]"
              imageSrc={
                resource.thumbnailUrl || "/products/iot_study_jam_image.jpg"
              }
              imageAlt={`Study Jam ${resource.title}`}
              title={resource.title || "Study Jam"} 
              subtitle="Learning Resource"
              description={
                resource.description.slice(0, 200) +
                  (resource.description.length > 200 ? "..." : "") ||
                "Join us for an engaging Study Jam where we dive deep into the latest trends and technologies in the industry. Whether you're a beginner or an expert, there's something for everyone to learn and explore."
              }
              category={
                <>
                  {resource.tags &&
                    resource.tags.map((tag, index) => (
                      <span className="inline-flex items-center rounded-full bg-[#8B2F00]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                        {tag}
                      </span>
                    ))} 
                </>
              } 
              date={new Date(resource.createdAt).toLocaleDateString(undefined, {
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
