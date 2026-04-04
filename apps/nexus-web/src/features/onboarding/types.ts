export type FormState = {
  nickname: string;
  bio: string;
  department: string;
  yearLevel: string;
  program: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioWebsiteUrl: string;
  technicalSkills: string;
  learningInterests: string;
  toolsAndTechnologies: string;
  otherLinks: string;
};

export type ProjectFormState = {
  id?: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  mainImageFile: File | null;
  mainImageUrl: string | null;
};
