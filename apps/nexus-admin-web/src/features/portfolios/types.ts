import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

// types inferred from contract models
export type Portfolio = z.infer<typeof contract.api.v1.portfolios.GET.response[200]>["data"][number];

export type PortfolioUpdate = {
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  nickname?: string | null;
  gdg_id?: string | null;
  membership_type?: string | null;
  department?: string | null;
  year_level?: number | null;
  program?: string | null;
  bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_website_url?: string | null;
  other_links?: string[];
  technical_skills?: string[];
  learning_interests?: string[];
  tools_and_technologies?: string[];
  is_public?: boolean;
};
