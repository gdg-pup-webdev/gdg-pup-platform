import { GdgMember } from "../domain/GdgMember";
import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { BadRequestError, NotFoundError } from "@/v1/errors/HttpError";

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
  private readonly relatedShare = 0.8;
  private readonly exploratoryPoolSize = 15;
  private readonly candidateFetchLimit = 120;
  private readonly exploratoryPublicFetchLimit = 90;
  private readonly requestRotationCounters = new Map<string, number>();
  private readonly enableTimingLogs =
    process.env.DEBUG_SUGGESTED_USERS_TIMING === "1";
  private readonly stableCollator = new Intl.Collator("en", {
    usage: "sort",
    sensitivity: "base",
    numeric: true,
  });

  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(
    gdgMemberId: string,
    pageNumber: number,
    pageSize: number,
    strategy: SimilarUsersStrategy = "relevant",
  ): Promise<{ list: GdgMember[]; count: number }> {
    if (pageNumber < 1)
      throw new BadRequestError("Page number must be greater than 0");
    if (pageSize < 1)
      throw new BadRequestError("Page size must be greater than 0");

    const member = await this.repo.findByGdgId(gdgMemberId);

    if (!member) {
      throw new NotFoundError(`Member not found for gdgId: ${gdgMemberId}`);
    }

    /**
     * define the ratios
     */
    const similarityBasisRatios = {
      program: 15,
      department: 30,
      yearLevel: 15,
      technicalSkills: 20,
      learningInterests: 25,
      toolsAndTechnologies: 20,
      random: 15,
    };
    const totalRatio = Object.values(similarityBasisRatios).reduce(
      (a, b) => a + b,
      0,
    );

    /**
     * defining the limits based on the ratios
     */
    let similarBasedOnProgramLimit = Math.ceil(
      (pageSize * similarityBasisRatios.program) / totalRatio,
    );
    let similarBasedOnDepartmentLimit = Math.ceil(
      (pageSize * similarityBasisRatios.department) / totalRatio,
    );
    let similarBasedOnYearLevelLimit = Math.ceil(
      (pageSize * similarityBasisRatios.yearLevel) / totalRatio,
    );
    let similarBasedOnTechnicalSkillsLimit = Math.ceil(
      (pageSize * similarityBasisRatios.technicalSkills) / totalRatio,
    );
    let similarBasedOnLearningInterestsLimit = Math.ceil(
      (pageSize * similarityBasisRatios.learningInterests) / totalRatio,
    );
    let similarBasedOnToolsAndTechnologiesLimit = Math.ceil(
      (pageSize * similarityBasisRatios.toolsAndTechnologies) / totalRatio,
    );

    let countLimit = similarBasedOnProgramLimit +
      similarBasedOnDepartmentLimit +
      similarBasedOnYearLevelLimit +
      similarBasedOnTechnicalSkillsLimit +
      similarBasedOnLearningInterestsLimit +
      similarBasedOnToolsAndTechnologiesLimit;

    /**
     * To avoid breaking the algorithm on small page sizes, we used ceil on the limits which may cause the total count limit to be greater than the page size. In that case, we will reduce the limits one by one starting from the least important similarity basis until the total count limit is equal to the page size.
     */
    if (countLimit > pageSize) {
      const excess = countLimit - pageSize;
      let iterations = 0;
      while (countLimit > pageSize && iterations < excess) {
        if (similarBasedOnToolsAndTechnologiesLimit > 0) {
          similarBasedOnToolsAndTechnologiesLimit--;
          countLimit--;
        } else if (similarBasedOnLearningInterestsLimit > 0) {
          similarBasedOnLearningInterestsLimit--;
          countLimit--;
        } else if (similarBasedOnTechnicalSkillsLimit > 0) {
          similarBasedOnTechnicalSkillsLimit--;
          countLimit--;
        } else if (similarBasedOnYearLevelLimit > 0) {
          similarBasedOnYearLevelLimit--;
          countLimit--;
        } else if (similarBasedOnDepartmentLimit > 0) {
          similarBasedOnDepartmentLimit--;
          countLimit--;
        } else if (similarBasedOnProgramLimit > 0) {
          similarBasedOnProgramLimit--;
          countLimit--;
        } else {
          break;
        }
        iterations++;
      }
    }

    const targetResultSize =
      strategy === "exploratory" ? Math.max(pageSize * 3, pageSize + 6) : pageSize;
    const seen = new Set<string>([member.props.gdgId]);
    const result: GdgMember[] = [];

    const addUnique = (users: GdgMember[]) => {
      for (const user of users) {
        if (!seen.has(user.props.gdgId)) {
          seen.add(user.props.gdgId);
          result.push(user);

          if (result.length >= targetResultSize) break;
        }
      }
    };

    const strategies = [
      { field: "program", value: member.props.program, limit: similarBasedOnProgramLimit },
      {
        field: "department",
        value: member.props.department,
        limit: similarBasedOnDepartmentLimit,
      },
      { field: "yearLevel", value: member.props.yearLevel, limit: similarBasedOnYearLevelLimit },
      {
        field: "technicalSkills",
        value: member.props.technicalSkills,
        limit: similarBasedOnTechnicalSkillsLimit,
      },
      {
        field: "learningInterests",
        value: member.props.learningInterests,
        limit: similarBasedOnLearningInterestsLimit,
      },
      {
        field: "toolsAndTechnologies",
        value: member.props.toolsAndTechnologies,
        limit: similarBasedOnToolsAndTechnologiesLimit,
      },
    ];

    for (const strategy of strategies) {
      if (result.length >= targetResultSize) break;

      const remaining = targetResultSize - result.length;

      const { list } = await this.repo.findSimilarMembersBasedOnField(
        member.props.gdgId,
        strategy.field,
        strategy.value,
        pageNumber,
        Math.min(strategy.limit, remaining),
      );

      addUnique(list);
    }

    if (result.length < targetResultSize) {
      const remaining = targetResultSize - result.length;

      const randomMembers = await this.repo.listRandomMembers(
        1,
        remaining,
        this.stringToNumber(`${gdgMemberId}:${pageNumber}:${pageSize}:${strategy}`),
      );

      addUnique(randomMembers.list);
    }

    /**
     * sorting based on similarity
     */
    const sortedMembers = this.rankBySimilarity(member, result);
    const paginatedMembers =
      strategy === "exploratory"
        ? this.rotateForRequestVariety(gdgMemberId, "related", sortedMembers).slice(
            0,
            pageSize,
          )
        : sortedMembers.slice(0, pageSize);

    return {
      list: paginatedMembers,
      count: paginatedMembers.length,
    };

    // const flowStartedAt = this.nowMs();
    // const stageDurationsMs: Record<string, number> = {};

    // const relevantCandidates = await this.withTimedStageAsync(
    //   stageDurationsMs,
    //   "fetchRelevantCandidates",
    //   () => this.getRelevantCandidates(gdgMemberId, sourceMember),
    // );

    // const rankedRelevantMembers = this.withTimedStage(
    //   stageDurationsMs,
    //   "rankRelevantCandidates",
    //   () => this.rankBySimilarity(sourceMember, relevantCandidates),
    // );

    // const from = (pageNumber - 1) * pageSize;

    // if (strategy === "relevant") {
    //   this.logTimingSummary({
    //     gdgMemberId,
    //     pageNumber,
    //     pageSize,
    //     strategy,
    //     totalCount: rankedRelevantMembers.length,
    //     startedAt: flowStartedAt,
    //     stageDurationsMs,
    //   });

    //   return {
    //     list: rankedRelevantMembers
    //       .slice(from, from + pageSize)
    //       .map((entry) => entry.member),
    //     count: rankedRelevantMembers.length,
    //   };
    // }

    // const publicCandidates = await this.withTimedStageAsync(
    //   stageDurationsMs,
    //   "fetchExploratoryPublicPool",
    //   () =>
    //     this.repo.findPublicMembersExcludingGdgId(
    //       gdgMemberId,
    //       this.exploratoryPublicFetchLimit,
    //     ),
    // );

    // const nonRelevantCandidates = this.withTimedStage(
    //   stageDurationsMs,
    //   "filterExploratoryNonRelevant",
    //   () =>
    //     this.getNonRelevantCandidates(
    //       sourceMember,
    //       rankedRelevantMembers,
    //       publicCandidates,
    //     ),
    // );

    // const rankedStrictNonRelevantMembers = this.withTimedStage(
    //   stageDurationsMs,
    //   "rankExploratoryNonRelevant",
    //   () => this.rankForExploration(sourceMember, nonRelevantCandidates),
    // );

    // const expandedNonRelevantMembers = this.withTimedStage(
    //   stageDurationsMs,
    //   "expandExploratoryNonRelevant",
    //   () =>
    //     this.expandExploratoryCandidates(
    //       sourceMember,
    //       rankedRelevantMembers,
    //       rankedStrictNonRelevantMembers,
    //       publicCandidates,
    //     ),
    // );

    // const { rotatedRelevantMembers, rotatedExpandedNonRelevantMembers } =
    //   this.withTimedStage(stageDurationsMs, "rotateExploratoryPools", () => ({
    //     rotatedRelevantMembers: this.rotateForRequestVariety(
    //       sourceMember.props.gdgId,
    //       "related",
    //       rankedRelevantMembers,
    //     ),
    //     rotatedExpandedNonRelevantMembers: this.rotateForRequestVariety(
    //       sourceMember.props.gdgId,
    //       "non-related",
    //       expandedNonRelevantMembers,
    //     ),
    //   }));

    // const exploratorySequence = this.withTimedStage(
    //   stageDurationsMs,
    //   "buildExploratorySequence",
    //   () =>
    //     this.buildExploratorySequence(
    //       rotatedRelevantMembers,
    //       rotatedExpandedNonRelevantMembers,
    //     ),
    // );

    // const list = exploratorySequence
    //   .slice(from, from + pageSize)
    //   .map((entry) => entry.member);

    // this.logTimingSummary({
    //   gdgMemberId,
    //   pageNumber,
    //   pageSize,
    //   strategy,
    //   totalCount: exploratorySequence.length,
    //   startedAt: flowStartedAt,
    //   stageDurationsMs,
    // });

    // return {
    //   list,
    //   count: exploratorySequence.length,
    // };
  }

  private rankBySimilarity(
    source: GdgMember,
    candidates: GdgMember[],
  ): GdgMember[] {
    const collator = new Intl.Collator("en", {
      usage: "sort",
      sensitivity: "base",
      numeric: true,
    });

    return candidates
      .map((member) => ({
        member,
        score: this.calculateSimilarityScore(source, member),
      }))
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return collator.compare(
          this.sortKey(left.member),
          this.sortKey(right.member),
        );
      })
      .map((entry, index) => entry.member);
  }

  private stringToNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
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

  /**
   * BELOW ARE UNUSED FUNCTIONS THAT MAY BE USED IN THE FUTURE FOR THE "EXPLORATORY" STRATEGY
   */

  /** */
  private nowMs(): number {
    return Date.now();
  }

  private recordStage(
    stageDurationsMs: Record<string, number>,
    stage: string,
    startedAt: number,
  ): number {
    const finishedAt = this.nowMs();
    stageDurationsMs[stage] = finishedAt - startedAt;
    return finishedAt;
  }

  private withTimedStage<T>(
    stageDurationsMs: Record<string, number>,
    stage: string,
    run: () => T,
  ): T {
    const startedAt = this.nowMs();
    const result = run();
    this.recordStage(stageDurationsMs, stage, startedAt);
    return result;
  }

  private async withTimedStageAsync<T>(
    stageDurationsMs: Record<string, number>,
    stage: string,
    run: () => Promise<T>,
  ): Promise<T> {
    const startedAt = this.nowMs();
    const result = await run();
    this.recordStage(stageDurationsMs, stage, startedAt);
    return result;
  }

  private logTimingSummary(params: {
    gdgMemberId: string;
    pageNumber: number;
    pageSize: number;
    strategy: SimilarUsersStrategy;
    totalCount: number;
    startedAt: number;
    stageDurationsMs: Record<string, number>;
  }): void {
    if (!this.enableTimingLogs) return;

    const totalDurationMs = this.nowMs() - params.startedAt;
    console.info("[suggested-users-timing]", {
      gdgMemberId: params.gdgMemberId,
      strategy: params.strategy,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      totalCount: params.totalCount,
      totalDurationMs,
      stageDurationsMs: params.stageDurationsMs,
    });
  }

  private async getRelevantCandidates(
    gdgMemberId: string,
    sourceMember: GdgMember,
  ): Promise<GdgMember[]> {
    const sourceProps = sourceMember.props;

    const candidates = await this.repo.findPublicSimilarMembersExcludingGdgId(
      gdgMemberId,
      {
        program: sourceProps.program,
        department: sourceProps.department,
        yearLevel: sourceProps.yearLevel,
        technicalSkills: sourceProps.technicalSkills,
        learningInterests: sourceProps.learningInterests,
        toolsAndTechnologies: sourceProps.toolsAndTechnologies,
      },
      this.candidateFetchLimit,
    );

    return candidates.filter((candidate) =>
      this.hasCoreRelevance(sourceMember, candidate),
    );
  }

  private getNonRelevantCandidates(
    sourceMember: GdgMember,
    rankedRelevantMembers: Array<{ member: GdgMember; score: number }>,
    publicCandidates: GdgMember[],
  ): GdgMember[] {
    const relevantIds = new Set(
      rankedRelevantMembers.map((entry) => entry.member.props.gdgId),
    );

    return publicCandidates.filter(
      (member) =>
        !relevantIds.has(member.props.gdgId) &&
        !this.hasCoreRelevance(sourceMember, member),
    );
  }

  private rankForExploration(
    source: GdgMember,
    candidates: GdgMember[],
  ): Array<{ member: GdgMember; score: number }> {
    return candidates
      .map((member) => ({
        member,
        score: 0,
      }))
      .sort((left, right) => {
        const leftSeed = this.seededOrderKey(source.props.gdgId, left.member);
        const rightSeed = this.seededOrderKey(source.props.gdgId, right.member);
        if (leftSeed !== rightSeed) return leftSeed - rightSeed;
        return this.stableCollator.compare(
          this.sortKey(left.member),
          this.sortKey(right.member),
        );
      });
  }

  private buildExploratorySequence(
    rankedRelevantMembers: Array<{ member: GdgMember; score: number }>,
    rankedNonRelevantMembers: Array<{ member: GdgMember; score: number }>,
  ): Array<{ member: GdgMember; score: number }> {
    const maxPoolSize = Math.min(
      this.exploratoryPoolSize,
      rankedRelevantMembers.length + rankedNonRelevantMembers.length,
    );

    if (maxPoolSize === 0) return [];
    if (rankedRelevantMembers.length === 0)
      return rankedNonRelevantMembers.slice(0, maxPoolSize);
    if (rankedNonRelevantMembers.length === 0)
      return rankedRelevantMembers.slice(0, maxPoolSize);

    let targetRelevantCount = Math.min(
      rankedRelevantMembers.length,
      Math.ceil(maxPoolSize * this.relatedShare),
    );
    let targetNonRelevantCount = Math.min(
      rankedNonRelevantMembers.length,
      maxPoolSize - targetRelevantCount,
    );

    let selectedCount = targetRelevantCount + targetNonRelevantCount;
    if (selectedCount < maxPoolSize) {
      const availableRelevant =
        rankedRelevantMembers.length - targetRelevantCount;
      const additionalRelevant = Math.min(
        availableRelevant,
        maxPoolSize - selectedCount,
      );
      targetRelevantCount += additionalRelevant;
      selectedCount += additionalRelevant;
    }

    if (selectedCount < maxPoolSize) {
      const availableNonRelevant =
        rankedNonRelevantMembers.length - targetNonRelevantCount;
      const additionalNonRelevant = Math.min(
        availableNonRelevant,
        maxPoolSize - selectedCount,
      );
      targetNonRelevantCount += additionalNonRelevant;
    }

    const selectedRelevant = rankedRelevantMembers.slice(
      0,
      targetRelevantCount,
    );
    const selectedNonRelevant = rankedNonRelevantMembers.slice(
      0,
      targetNonRelevantCount,
    );

    const relatedBatchSize = Math.max(
      1,
      Math.round(this.relatedShare / (1 - this.relatedShare)),
    );

    const combined: Array<{ member: GdgMember; score: number }> = [];
    let relatedIndex = 0;
    let nonRelevantIndex = 0;

    while (
      relatedIndex < selectedRelevant.length ||
      nonRelevantIndex < selectedNonRelevant.length
    ) {
      for (
        let step = 0;
        step < relatedBatchSize && relatedIndex < selectedRelevant.length;
        step += 1
      ) {
        combined.push(selectedRelevant[relatedIndex]);
        relatedIndex += 1;
      }

      if (nonRelevantIndex < selectedNonRelevant.length) {
        combined.push(selectedNonRelevant[nonRelevantIndex]);
        nonRelevantIndex += 1;
      }

      if (relatedIndex >= selectedRelevant.length) {
        combined.push(...selectedNonRelevant.slice(nonRelevantIndex));
        break;
      }

      if (nonRelevantIndex >= selectedNonRelevant.length) {
        combined.push(...selectedRelevant.slice(relatedIndex));
        break;
      }
    }

    return combined;
  }

  private expandExploratoryCandidates(
    sourceMember: GdgMember,
    rankedRelevantMembers: Array<{ member: GdgMember; score: number }>,
    rankedStrictNonRelevantMembers: Array<{ member: GdgMember; score: number }>,
    publicCandidates: GdgMember[],
  ): Array<{ member: GdgMember; score: number }> {
    const totalStrictCandidates =
      rankedRelevantMembers.length + rankedStrictNonRelevantMembers.length;
    if (totalStrictCandidates >= this.exploratoryPoolSize) {
      return rankedStrictNonRelevantMembers;
    }

    const usedIds = new Set<string>([
      ...rankedRelevantMembers.map((entry) => entry.member.props.gdgId),
      ...rankedStrictNonRelevantMembers.map(
        (entry) => entry.member.props.gdgId,
      ),
    ]);

    let fallbackCandidates = publicCandidates.filter(
      (member) => !usedIds.has(member.props.gdgId),
    );

    if (fallbackCandidates.length === 0) return rankedStrictNonRelevantMembers;

    const rankedFallback = this.rankForExploration(
      sourceMember,
      fallbackCandidates,
    );
    return [...rankedStrictNonRelevantMembers, ...rankedFallback];
  }

  private seededOrderKey(sourceGdgId: string, member: GdgMember): number {
    const key = `${sourceGdgId}:${member.props.gdgId}`;
    let hash = 0;

    for (let index = 0; index < key.length; index += 1) {
      hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
    }

    return hash;
  }

  private rotateForRequestVariety<T>(
    sourceGdgId: string,
    lane: "related" | "non-related",
    candidates: T[],
  ): T[] {
    if (candidates.length <= 1) return candidates;

    const key = `${sourceGdgId}:${lane}`;
    const currentCounter = this.requestRotationCounters.get(key) ?? 0;
    const nextCounter = currentCounter + 1;
    this.requestRotationCounters.set(key, nextCounter);

    const offset = nextCounter % candidates.length;
    if (offset === 0) return candidates;

    return [...candidates.slice(offset), ...candidates.slice(0, offset)];
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
    const nearbyYearLevel =
      sourceProps.yearLevel !== null &&
      candidateProps.yearLevel !== null &&
      Math.abs(sourceProps.yearLevel - candidateProps.yearLevel) <= 1;

    return (
      sameProgram ||
      sameDepartment ||
      nearbyYearLevel ||
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
