import { GdgMember } from "../domain/GdgMember";
import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { NotFoundError } from "@/v1/errors/HttpError";

const SIMILARITY_WEIGHTS = {
  program: 22,
  yearLevel: 18,
  department: 12,
  membershipType: 10,
  technicalSkills: 22,
  learningInterests: 8,
  toolsAndTechnologies: 8,
};

export type SimilarUsersStrategy = "relevant" | "exploratory";

export class GetSimilarUsers {
  private readonly exploratoryRatio = 0.9;

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
      throw new NotFoundError(`Member not found for gdgId: ${gdgMemberId}`);
    }

    const candidates = await this.repo.findMembersExcludingGdgId(gdgMemberId);

    const scoredCandidates = candidates.map((member) => ({
      member,
      score: this.calculateSimilarityScore(sourceMember, member),
      hasCoreRelevance: this.hasCoreRelevance(sourceMember, member),
    }));

    const rankedMembers = scoredCandidates
      .filter((entry) =>
        strategy === "relevant" ? entry.hasCoreRelevance : true,
      )
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;

        const leftName = this.sortKey(left.member);
        const rightName = this.sortKey(right.member);

        return leftName.localeCompare(rightName);
      });

    const from = (pageNumber - 1) * pageSize;
    const processedPageMembers =
      strategy === "exploratory"
        ? this.buildExploratoryPage(scoredCandidates, from, pageSize)
        : rankedMembers.slice(from, from + pageSize);
    const list = processedPageMembers.map((entry) => entry.member);

    return {
      list,
      count:
        strategy === "exploratory"
          ? scoredCandidates.length
          : rankedMembers.length,
    };
  }

  private buildExploratoryPage(
    scoredCandidates: Array<{
      member: GdgMember;
      score: number;
      hasCoreRelevance: boolean;
    }>,
    from: number,
    pageSize: number,
  ): Array<{ member: GdgMember; score: number }> {
    if (scoredCandidates.length === 0) return [];

    const sortedBySimilarityDesc = [...scoredCandidates].sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return this.sortKey(left.member).localeCompare(
        this.sortKey(right.member),
      );
    });

    const nonSimilar = sortedBySimilarityDesc
      .filter((entry) => !entry.hasCoreRelevance)
      .sort((left, right) => {
        if (left.score !== right.score) return left.score - right.score;
        return this.sortKey(left.member).localeCompare(
          this.sortKey(right.member),
        );
      });

    const similar = sortedBySimilarityDesc.filter(
      (entry) => entry.hasCoreRelevance,
    );
    const targetNonSimilarCount = Math.min(
      nonSimilar.length,
      Math.ceil(pageSize * this.exploratoryRatio),
    );

    const combined = [
      ...nonSimilar.slice(0, targetNonSimilarCount),
      ...similar,
      ...nonSimilar.slice(targetNonSimilarCount),
    ];

    return combined.slice(from, from + pageSize).map((entry) => ({
      member: entry.member,
      score: entry.score,
    }));
  }

  private calculateSimilarityScore(
    source: GdgMember,
    candidate: GdgMember,
  ): number {
    const sourceProps = source.props;
    const candidateProps = candidate.props;

    return (
      this.scoreStringSimilarity(
        sourceProps.program,
        candidateProps.program,
        SIMILARITY_WEIGHTS.program,
      ) +
      this.scoreYearLevelSimilarity(
        sourceProps.yearLevel,
        candidateProps.yearLevel,
        SIMILARITY_WEIGHTS.yearLevel,
      ) +
      this.scoreStringSimilarity(
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

  private scoreStringSimilarity(
    source: string | null,
    candidate: string | null,
    weight: number,
  ): number {
    if (!source || !candidate) return 0;

    const normalizedSource = this.normalize(source);
    const normalizedCandidate = this.normalize(candidate);

    if (normalizedSource === normalizedCandidate) return weight;

    // Treat equivalent abbreviations and aliases as strong matches.
    const canonicalSource = this.canonicalizeAcademicText(normalizedSource);
    const canonicalCandidate =
      this.canonicalizeAcademicText(normalizedCandidate);
    if (canonicalSource === canonicalCandidate)
      return Math.round(weight * 0.85);

    const sourceTokens = this.tokenize(canonicalSource);
    const candidateTokens = this.tokenize(canonicalCandidate);

    if (sourceTokens.length === 0 || candidateTokens.length === 0) return 0;

    const overlap = sourceTokens.filter((token) =>
      candidateTokens.includes(token),
    );
    if (overlap.length === 0) return 0;

    const union = new Set([...sourceTokens, ...candidateTokens]);
    return Math.round((overlap.length / union.size) * weight * 0.75);
  }

  private scoreYearLevelSimilarity(
    source: number | null,
    candidate: number | null,
    weight: number,
  ): number {
    if (source === null || candidate === null) return 0;
    const diff = Math.abs(source - candidate);

    if (diff === 0) return weight;
    if (diff === 1) return Math.round(weight * 0.6);
    if (diff === 2) return Math.round(weight * 0.3);

    return 0;
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

  private hasCoreRelevance(source: GdgMember, candidate: GdgMember): boolean {
    const sourceProps = source.props;
    const candidateProps = candidate.props;

    const sameProgram = this.isEquivalentAcademicText(
      sourceProps.program,
      candidateProps.program,
    );
    const sameDepartment = this.isEquivalentAcademicText(
      sourceProps.department,
      candidateProps.department,
    );

    return (
      sameProgram ||
      sameDepartment ||
      this.hasCollectionOverlap(
        sourceProps.technicalSkills,
        candidateProps.technicalSkills,
      ) ||
      this.hasCollectionOverlap(
        sourceProps.learningInterests,
        candidateProps.learningInterests,
      ) ||
      this.hasCollectionOverlap(
        sourceProps.toolsAndTechnologies,
        candidateProps.toolsAndTechnologies,
      )
    );
  }

  private isEquivalentAcademicText(
    source: string | null,
    candidate: string | null,
  ): boolean {
    if (!source || !candidate) return false;

    const normalizedSource = this.canonicalizeAcademicText(
      this.normalize(source),
    );
    const normalizedCandidate = this.canonicalizeAcademicText(
      this.normalize(candidate),
    );

    return normalizedSource === normalizedCandidate;
  }

  private hasCollectionOverlap(source: string[], candidate: string[]): boolean {
    const normalizedSource = this.normalizeCollection(source);
    const normalizedCandidate = this.normalizeCollection(candidate);

    return normalizedSource.some((value) =>
      normalizedCandidate.includes(value),
    );
  }

  private normalizeCollection(values: string[]): string[] {
    return [
      ...new Set(values.map((value) => this.normalize(value)).filter(Boolean)),
    ];
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private tokenize(value: string): string[] {
    return [...new Set(value.split(/[^a-z0-9]+/).filter(Boolean))];
  }

  private canonicalizeAcademicText(value: string): string {
    return value
      .replace(/\bbs\b/g, "bachelor of science")
      .replace(/\bbit\b/g, "bachelor of science information technology")
      .replace(/\bbsit\b/g, "bachelor of science information technology")
      .replace(/\bbscs\b/g, "bachelor of science computer science")
      .replace(/\bbsce\b/g, "bachelor of science computer engineering")
      .replace(/\bcp[e]?\b/g, "computer engineering")
      .replace(/\bcs\b/g, "computer science")
      .replace(/\bit\b/g, "information technology")
      .replace(/\bweb dev(elopment)?\b/g, "web development")
      .replace(/\bcloud\b/g, "cloud solutions");
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
