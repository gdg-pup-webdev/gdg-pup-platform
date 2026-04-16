import { SparkmatesProfile } from "@/features/sparkmates/types";
import { Badge, Text } from "@packages/spark-ui";

const SPARK_BADGE = {
  variantBlue: "blue",
} as const;

function SkillSectionIcon({ type }: { type: "technical" | "learning" | "tools" }) {
  if (type === "technical") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "learning") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 5.5h8v14H4zM12 4l8-1v16l-8 1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "tools") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 21h10M9 17h6M10 3h4l1 4H9l1-4zM8 11h8l-1 6H9l-1-6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

}

function CategoryCard({
  title,
  chips,
  iconType,
}: {
  title: string;
  chips: string[];
  iconType: "technical" | "learning" | "tools";
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-6 py-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
      <div className="mb-3 flex items-center gap-3">
        <SkillSectionIcon type={iconType} />
        <Text variant="body-lg" className="text-white" weight="medium">
          {title}
        </Text>
      </div>
      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Badge key={`${title}-${chip}`} variant={SPARK_BADGE.variantBlue as never} className="text-[#F2F4F8]">
              {chip}
            </Badge>
          ))}
        </div>
      ) : (
        <Text variant="body-sm" className="text-[#C1C7CD]">
          No items yet.
        </Text>
      )}
    </div>
  );
}

export function PublicSkillsAndLinksSection({
  portfolio,
}: {
  portfolio: SparkmatesProfile | null;
}) {
  const skills = portfolio?.technicalSkills ?? [];
  const interests = portfolio?.learningInterests ?? [];
  const tools = portfolio?.toolsAndTechnologies ?? [];

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between gap-3">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Skills and Interests
        </Text>
      </div>

      <div className="space-y-3">
        <CategoryCard title="Technical Skills" chips={skills} iconType="technical" />
        <CategoryCard title="Learning Interests" chips={interests} iconType="learning" />
        <CategoryCard title="Tools & Technologies" chips={tools} iconType="tools" />
      </div>
    </section>
  );
}
