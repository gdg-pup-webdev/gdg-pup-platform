import { useMemo } from "react";
import type { SparkmatesPortfolio, SuggestedSparkmate } from "../types";

const DUMMY_SUGGESTED_SPARKMATES: SuggestedSparkmate[] = [
  {
    gdgId: "GDGPUP-26-009911",
    name: "Bertha Pfeffer",
    programYear: "BSIT • 3rd Year",
    bio: "validation enthusiast, singer",
    avatarUrl: "https://www.figma.com/api/mcp/asset/2d145b01-3568-4362-b7ba-459df26672d8",
    skills: ["TypeScript", "React", "Testing"],
    interests: ["Web Security", "Open Source"],
  },
  {
    gdgId: "GDGPUP-26-009912",
    name: "Alton Pfannerstill",
    programYear: "BSCS • 2nd Year",
    bio: "teacher, engineer, leader",
    avatarUrl: "https://www.figma.com/api/mcp/asset/3512f3b2-f894-4fe4-b47d-b1d1ce0213f7",
    skills: ["Node.js", "Cloud", "APIs"],
    interests: ["Community Building", "AI"],
  },
  {
    gdgId: "GDGPUP-26-009913",
    name: "Billie Rosenbaum",
    programYear: "BSIT • 4th Year",
    bio: "mousse supporter, public speaker",
    avatarUrl: "https://www.figma.com/api/mcp/asset/bbaef8bf-1737-4fed-a064-dbbfa9e90070",
    skills: ["UI/UX", "Figma", "React"],
    interests: ["Design Systems", "Frontend"],
  },
  {
    gdgId: "GDGPUP-26-009914",
    name: "Roselio Bashirian",
    programYear: "BSIT • 1st Year",
    bio: "audience advocate",
    avatarUrl: "https://www.figma.com/api/mcp/asset/adea7793-212c-43e1-96ac-b067f6b2a27f",
    skills: ["Python", "Data", "SQL"],
    interests: ["Machine Learning", "Data Viz"],
  },
  {
    gdgId: "GDGPUP-26-009915",
    name: "Karla Parker",
    programYear: "BSIT • 2nd Year",
    bio: "parent, developer, artist",
    avatarUrl: "https://www.figma.com/api/mcp/asset/5d7155ef-d30d-4c75-a6eb-6c4368f01dd3",
    skills: ["Flutter", "Firebase", "UX Writing"],
    interests: ["Mobile", "Accessibility"],
  },
  {
    gdgId: "GDGPUP-26-009916",
    name: "Jason Herman",
    programYear: "BSCS • 4th Year",
    bio: "engineer, foodie, painter",
    avatarUrl: "https://www.figma.com/api/mcp/asset/659a166e-338f-4d61-a6b3-3b2346de31ba",
    skills: ["Go", "Kubernetes", "Cloud"],
    interests: ["DevOps", "Platform Engineering"],
  },
  {
    gdgId: "GDGPUP-26-009917",
    name: "Caroline Heeney",
    programYear: "BSIT • 3rd Year",
    bio: "film lover",
    avatarUrl: "https://www.figma.com/api/mcp/asset/b8bed12b-12d5-4f15-9df6-d7bafdf7c48d",
    skills: ["Next.js", "TypeScript", "Content"],
    interests: ["Docs", "Web Performance"],
  },
  {
    gdgId: "GDGPUP-26-009918",
    name: "Bill Frami",
    programYear: "BSIT • 2nd Year",
    bio: "aesthetic lover",
    avatarUrl: "https://www.figma.com/api/mcp/asset/273bd924-fb9a-47bf-9c84-9ed92ef18013",
    skills: ["Tailwind", "Branding", "Motion"],
    interests: ["Frontend", "3D"],
  },
  {
    gdgId: "GDGPUP-26-009919",
    name: "Conrad Hills",
    programYear: "BSIT • 1st Year",
    bio: "charlatan devotee",
    avatarUrl: "https://www.figma.com/api/mcp/asset/a8755823-e2ed-4259-bcf0-36705e655efb",
    skills: ["Java", "Spring", "REST"],
    interests: ["Backend", "Architecture"],
  },
  {
    gdgId: "GDGPUP-26-009920",
    name: "Angel Bins",
    programYear: "BSCS • 3rd Year",
    bio: "author",
    avatarUrl: "https://www.figma.com/api/mcp/asset/dfaeb6bd-cfdc-4fbe-a138-e0108074eb19",
    skills: ["Rust", "C", "Systems"],
    interests: ["Performance", "Compilers"],
  },
];

function normalize(values: string[]) {
  return values.map((value) => value.trim().toLowerCase()).filter(Boolean);
}

function getSimilarityScore(
  viewerPortfolio: SparkmatesPortfolio | null,
  candidate: SuggestedSparkmate,
) {
  if (!viewerPortfolio) {
    return 0;
  }

  const viewerSkills = normalize(viewerPortfolio.technical_skills);
  const viewerInterests = normalize(viewerPortfolio.learning_interests);
  const viewerTools = normalize(viewerPortfolio.tools_and_technologies);

  const candidateSkills = normalize(candidate.skills);
  const candidateInterests = normalize(candidate.interests);

  const skillOverlap = candidateSkills.filter(
    (skill) => viewerSkills.includes(skill) || viewerTools.includes(skill),
  ).length;

  const interestOverlap = candidateInterests.filter((interest) =>
    viewerInterests.includes(interest),
  ).length;

  return skillOverlap * 3 + interestOverlap * 2;
}

export function useSuggestedSparkmates({
  search,
  viewerGdgId,
  viewerPortfolio,
}: {
  search: string;
  viewerGdgId?: string;
  viewerPortfolio: SparkmatesPortfolio | null;
}) {
  return useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const sorted = [...DUMMY_SUGGESTED_SPARKMATES]
      .filter((candidate) => candidate.gdgId !== viewerGdgId)
      .map((candidate) => ({
        candidate,
        score: getSimilarityScore(viewerPortfolio, candidate),
      }))
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.candidate);

    if (!searchTerm) {
      return sorted;
    }

    return sorted.filter((candidate) => {
      const haystack = `${candidate.name} ${candidate.bio} ${candidate.programYear}`.toLowerCase();
      return haystack.includes(searchTerm);
    });
  }, [search, viewerGdgId, viewerPortfolio]);
}
