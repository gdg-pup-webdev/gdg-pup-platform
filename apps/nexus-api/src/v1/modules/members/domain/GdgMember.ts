import { ChangeProfilePicture } from '../useCases/ChangeProfilePicture';
import { ValidationError } from '@/v1/errors/HttpError';

export const GDG_MEMBER_LIST_FIELD_MAX_ITEMS = 20;

const DEFAULT_SPARKMATES_SECTION_ORDER = [
  "customButtons",
  "skillsAndInterests",
  "projects",
  "gdgImpact",
  "badges",
] as const;

export type SparkmatesSectionId =
  (typeof DEFAULT_SPARKMATES_SECTION_ORDER)[number];

const isSparkmatesSectionId = (value: string): value is SparkmatesSectionId => {
  return (DEFAULT_SPARKMATES_SECTION_ORDER as readonly string[]).includes(value);
};

const normalizeSectionOrder = (
  value: SparkmatesSectionId[] | string[] | undefined,
): SparkmatesSectionId[] => {
  const incoming: SparkmatesSectionId[] = Array.isArray(value)
    ? value.reduce<SparkmatesSectionId[]>((acc, item) => {
        if (typeof item === "string" && isSparkmatesSectionId(item)) {
          acc.push(item);
        }
        return acc;
      }, [])
    : [];

  const unique: SparkmatesSectionId[] = Array.from(new Set(incoming));
  const missing: SparkmatesSectionId[] = DEFAULT_SPARKMATES_SECTION_ORDER.filter(
    (item): item is SparkmatesSectionId => !unique.includes(item),
  );

  return [...unique, ...missing];
};

export type GdgMemberProps = {
  // Core Identifiers
  gdgId: string;
  email: string;

  /**
   * membership
   */

  membershipType: string | null;

  /**
   * profile
   */
  avatarUrl: string | null;
  avatarUrl64: string | null;
  avatarUrl512: string | null;

  // education
  program: string | null;
  yearLevel: number | null;
  department: string | null;

  // name
  displayName: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;

  /**
   * portfolio
   */
  // Bio
  bio: string | null;

  // Socials
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioWebsiteUrl: string | null;
  otherLinks: string[];

  // Skills & Interests
  technicalSkills: string[];
  learningInterests: string[];
  toolsAndTechnologies: string[];
  sectionOrder: SparkmatesSectionId[];

  isOnboarded: boolean | null;
  isPublic: boolean | null;
};

export type GdgMemberInsertProps = GdgMemberProps;
export type GdgMemberUpdateProps = Partial<GdgMemberInsertProps>;

type GdgMemberListFieldName =
  | "otherLinks"
  | "technicalSkills"
  | "learningInterests"
  | "toolsAndTechnologies";

const assertListFieldItemCount = (
  fieldName: GdgMemberListFieldName,
  values: string[] | undefined,
): void => {
  if (!values) {
    return;
  }

  if (values.length > GDG_MEMBER_LIST_FIELD_MAX_ITEMS) {
    throw new ValidationError(
      `'${fieldName}' can contain at most ${GDG_MEMBER_LIST_FIELD_MAX_ITEMS} items.`,
    );
  }
};

const assertListFieldLimits = (props: {
  otherLinks?: string[];
  technicalSkills?: string[];
  learningInterests?: string[];
  toolsAndTechnologies?: string[];
}): void => {
  assertListFieldItemCount("otherLinks", props.otherLinks);
  assertListFieldItemCount("technicalSkills", props.technicalSkills);
  assertListFieldItemCount("learningInterests", props.learningInterests);
  assertListFieldItemCount("toolsAndTechnologies", props.toolsAndTechnologies);
};

export class GdgMember {
  private _props: GdgMemberProps;

  private constructor(props: GdgMemberProps) {
    this._props = {
      ...props,
      sectionOrder: normalizeSectionOrder(props.sectionOrder),
    };
  }

  static create(props: GdgMemberInsertProps): GdgMember {
    assertListFieldLimits(props);
    return new GdgMember(props);
  }

  static hydrate(props: GdgMemberProps): GdgMember {
    return new GdgMember(props);
  }

  get props(): GdgMemberProps {
    return this._props;
  }

  update(updates: GdgMemberUpdateProps): void {
    assertListFieldLimits(updates);

    this._props = {
      ...this._props,
      ...updates,
      sectionOrder: normalizeSectionOrder(updates.sectionOrder ?? this._props.sectionOrder),
    };
  } 

  makePortfolioPublic() : void {
    this._props.isPublic = true
  }

  makePortfolioPrivate() : void {
    this._props.isPublic = false
  }

  changeProfilePicture(urls: {
    avatarUrl: string;
    avatarUrl64: string;
    avatarUrl512: string;
  }) : void {
    this._props.avatarUrl = urls.avatarUrl
    this._props.avatarUrl64 = urls.avatarUrl64
    this._props.avatarUrl512 = urls.avatarUrl512
  }
}
