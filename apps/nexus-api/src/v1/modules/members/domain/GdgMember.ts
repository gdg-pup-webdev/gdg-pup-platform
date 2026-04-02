import { ChangeProfilePicture } from '../useCases/ChangeProfilePicture';
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

  isPublic: boolean;
};

export type GdgMemberInsertProps = GdgMemberProps;
export type GdgMemberUpdateProps = Partial<GdgMemberInsertProps>;

export class GdgMember {
  private _props: GdgMemberProps;

  private constructor(props: GdgMemberProps) {
    this._props = props;
  }

  static create(props: GdgMemberInsertProps): GdgMember {
    return new GdgMember(props);
  }

  static hydrate(props: GdgMemberProps): GdgMember {
    return new GdgMember(props);
  }

  get props(): GdgMemberProps {
    return this._props;
  }

  update(updates: GdgMemberUpdateProps): void {
    this._props = {
      ...this._props,
      ...updates,
    };
  } 

  makePortfolioPublic() : void {
    this._props.isPublic = true
  }

  makePortfolioPrivate() : void {
    this._props.isPublic = false
  }

  changeProfilePicture(url: string) : void {
    this._props.avatarUrl = url
  }
}
