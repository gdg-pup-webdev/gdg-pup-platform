export type PortfolioProps = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  // Personal Information
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  nickname: string | null;
  gdgId: string | null;
  membershipType: string | null;
  department: string | null;
  yearLevel: number | null;
  program: string | null;

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
  profileImage: string | null;
};

export type PortfolioUpdateProps = Partial<
  Omit<PortfolioProps, "id" | "userId" | "createdAt" | "updatedAt">
>;

export class Portfolio {
  private _props: PortfolioProps;

  constructor(props: PortfolioProps) {
    this._props = props;
  }

  static hydrate = (props: PortfolioProps): Portfolio => {
    return new Portfolio(props);
  };

  get props(): PortfolioProps {
    return this._props;
  }

  update = (updates: PortfolioUpdateProps): void => {
    this._props = { ...this._props, ...updates };
  };
}
