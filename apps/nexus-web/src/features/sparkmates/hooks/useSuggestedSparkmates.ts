import type { SparkmatesPortfolio, SuggestedSparkmate } from "../types";
import { useSuggestedMembers } from "./useSuggestedMembers";


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
}: {
  search: string;
  viewerGdgId?: string; 
}) {

  return useSuggestedMembers(viewerGdgId || "", 1, 10);



  // return useMemo(() => {
  //   const searchTerm = search.trim().toLowerCase();

  //   const sorted = [...DUMMY_SUGGESTED_SPARKMATES]
  //     // .filter((candidate) => candidate.gdgId !== viewerGdgId)
  //     // .map((candidate) => ({
  //     //   candidate,
  //     //   score: getSimilarityScore(viewerPortfolio, candidate),
  //     // }))
  //     // .sort((left, right) => right.score - left.score)
  //     // .map((entry) => entry.candidate);

  //   if (!searchTerm) {
  //     return sorted;
  //   }

  //   return sorted.filter((candidate) => {
  //     const haystack = `${candidate.name} ${candidate.bio} ${candidate.programYear}`.toLowerCase();
  //     return haystack.includes(searchTerm);
  //   });
  // }, [search, viewerGdgId]);
}
