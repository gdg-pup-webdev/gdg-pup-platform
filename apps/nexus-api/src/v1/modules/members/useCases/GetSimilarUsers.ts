import { GdgMember } from "../domain/GdgMember";
import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";

const SIMILARITY_WEIGHTS = {
  program: 25,
  yearLevel: 20,
  department: 15,
  membershipType: 10,
  technicalSkills: 20,
  learningInterests: 5,
  toolsAndTechnologies: 5,
};

export type SimilarUsersStrategy = "relevant" | "exploratory";

export class GetSimilarUsers {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(
    gdgMemberId: string,
    pageNumber: number,
    pageSize: number,
    strategy: SimilarUsersStrategy = "relevant",
  ): Promise<{ list: GdgMember[]; count: number }> {
    if (pageNumber < 1) throw new Error("Page number must be greater than 0");
    if (pageSize < 1) throw new Error("Page size must be greater than 0");

    const sourceMember = await this.repo.findByGdgId(gdgMemberId);
    if (!sourceMember) {
      return { list: [], count: 0 };
    }

    const candidates =
      await this.repo.findPublicMembersExcludingGdgId(gdgMemberId);

    const rankedMembers = candidates
      .map((member) => ({
        member,
        score: this.calculateSimilarityScore(sourceMember, member),
      }))
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;

        const leftName = this.sortKey(left.member);
        const rightName = this.sortKey(right.member);

        return leftName.localeCompare(rightName);
      });

    const processedMembers =
      strategy === "exploratory"
        ? this.mixRelevantWithRandom(rankedMembers, 0.2)
        : rankedMembers;

    const from = (pageNumber - 1) * pageSize;
    const list = processedMembers
      .slice(from, from + pageSize)
      .map((entry) => entry.member);

    return {
      list,
      count: processedMembers.length,
    };
  }

  private mixRelevantWithRandom(
    rankedMembers: Array<{ member: GdgMember; score: number }>,
    randomRatio: number,
  ): Array<{ member: GdgMember; score: number }> {
    if (rankedMembers.length === 0) return rankedMembers;

    const result = [...rankedMembers];
    const randomCount = Math.max(1, Math.ceil(result.length * randomRatio));

    // Randomly select indices to replace (avoid duplicates)
    const indicesToReplace = new Set<number>();
    while (
      indicesToReplace.size < randomCount &&
      indicesToReplace.size < result.length
    ) {
      indicesToReplace.add(Math.floor(Math.random() * result.length));
    }

    // For each position to replace, pick a random different position and swap
    indicesToReplace.forEach((replaceIdx) => {
      let randomIdx = Math.floor(Math.random() * result.length);

      // Ensure randomIdx is different from replaceIdx
      while (randomIdx === replaceIdx) {
        randomIdx = Math.floor(Math.random() * result.length);
      }

      // Swap the members
      const temp = result[replaceIdx];
      result[replaceIdx] = result[randomIdx];
      result[randomIdx] = temp;
    });

    return result;
  }

  private calculateSimilarityScore(
    source: GdgMember,
    candidate: GdgMember,
  ): number {
    const sourceProps = source.props;
    const candidateProps = candidate.props;

    return (
      this.scoreExactMatch(
        sourceProps.program,
        candidateProps.program,
        SIMILARITY_WEIGHTS.program,
      ) +
      this.scoreExactMatch(
        sourceProps.yearLevel,
        candidateProps.yearLevel,
        SIMILARITY_WEIGHTS.yearLevel,
      ) +
      this.scoreExactMatch(
        sourceProps.department,
        candidateProps.department,
        SIMILARITY_WEIGHTS.department,
      ) +
      this.scoreExactMatch(
        sourceProps.membershipType,
        candidateProps.membershipType,
        SIMILARITY_WEIGHTS.membershipType,
      ) +
      this.scoreCollectionOverlap(
        sourceProps.technicalSkills,
        candidateProps.technicalSkills,
        SIMILARITY_WEIGHTS.technicalSkills,
      ) +
      this.scoreCollectionOverlap(
        sourceProps.learningInterests,
        candidateProps.learningInterests,
        SIMILARITY_WEIGHTS.learningInterests,
      ) +
      this.scoreCollectionOverlap(
        sourceProps.toolsAndTechnologies,
        candidateProps.toolsAndTechnologies,
        SIMILARITY_WEIGHTS.toolsAndTechnologies,
      )
    );
  }

  private scoreExactMatch<T extends string | number | null>(
    source: T,
    candidate: T,
    weight: number,
  ): number {
    if (source === null || candidate === null) return 0;

    if (typeof source === "string" && typeof candidate === "string") {
      return this.normalize(source) === this.normalize(candidate) ? weight : 0;
    }

    return source === candidate ? weight : 0;
  }

  private scoreCollectionOverlap(
    source: string[],
    candidate: string[],
    weight: number,
  ): number {
    const normalizedSource = this.normalizeCollection(source);
    const normalizedCandidate = this.normalizeCollection(candidate);

    if (normalizedSource.length === 0 || normalizedCandidate.length === 0)
      return 0;

    const overlap = normalizedSource.filter((value) =>
      normalizedCandidate.includes(value),
    );
    const union = new Set([...normalizedSource, ...normalizedCandidate]);

    return Math.round((overlap.length / union.size) * weight);
  }

  private normalizeCollection(values: string[]): string[] {
    return [
      ...new Set(values.map((value) => this.normalize(value)).filter(Boolean)),
    ];
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private sortKey(member: GdgMember): string {
    const props = member.props;
    return (
      props.displayName ||
      [props.firstName, props.middleName, props.lastName, props.suffix]
        .filter(Boolean)
        .join(" ") ||
      props.gdgId
    );
  }
}
