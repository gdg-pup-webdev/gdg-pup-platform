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
  isPublic: boolean | null;
};

export type ProjectFormState = {
  id?: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  projectLink: string;
  imageFiles?: File[];
  imageUrls?: string[];
  originalImageUrls?: string[];
  mainImageFile: File | null;
  mainImageUrl: string | null;
  secondaryImageFile: File | null;
  secondaryImageUrl: string | null;
  tertiaryImageFile: File | null;
  tertiaryImageUrl: string | null;
};
