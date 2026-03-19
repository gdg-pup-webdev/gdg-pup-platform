import { SparkmatesModuleController } from "@/v1/modules/sparkmatesModule";
import { SparkmatesSource } from "@/v1/modules/sparkmatesModule/domain/Sparkmates";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

function toRow(props: any) {
  return {
    id: props.id,
    user_id: props.userId,
    created_at: props.createdAt,
    updated_at: props.updatedAt,
    first_name: props.fullName?.split(" ")[0] || null, // Best effort since we only have fullName in SparkmatesPublicPortfolio
    middle_name: null,
    last_name: props.fullName?.split(" ").slice(1).join(" ") || null,
    nickname: props.nickname,
    gdg_id: props.gdgId,
    membership_type: props.membershipType,
    department: props.department,
    year_level: props.yearAndProgram ? parseInt(props.yearAndProgram.split(" ")[0]) : null,
    program: props.yearAndProgram ? props.yearAndProgram.split("-").slice(1).join("-").trim() : null,
    bio: props.bio,
    github_url: props.githubUrl,
    linkedin_url: props.linkedinUrl,
    portfolio_website_url: props.portfolioWebsiteUrl,
    other_links: props.otherLinks,
    technical_skills: props.technicalSkills,
    learning_interests: props.learningInterests,
    tools_and_technologies: props.toolsAndTechnologies,
    is_public: props.isPublic,
    profile_image: props.profileImage,
  };
}

function normalizeSource(raw: string | undefined): SparkmatesSource {
  if (raw === "nfc_card" || raw === "qr_code" || raw === "direct_link") {
    return raw;
  }

  return "direct_link";
}

export class SparkmatesHttpController {
  constructor(
    private readonly sparkmatesModuleController: SparkmatesModuleController,
  ) {}

  getSparkmateByGdgId: RequestHandler = createExpressController(
    contract.api.v1.sparkmates.gdgId.GET,
    async ({ input, output, ctx }) => {
      const source = normalizeSource(input.query.source);
      const userAgent = ctx.req.headers["user-agent"] || null;

      const record = await this.sparkmatesModuleController.getSparkmateByGdgId({
        gdgId: input.params.gdgId,
        source,
        userAgent,
      });

      return output(200, {
        status: "success",
        message: "Sparkmates profile resolved successfully",
        data: {
          gdg_id: record.gdgId,
          owner_user_id: record.ownerUserId,
          source: record.source,
          status: record.status,
          portfolio: record.portfolio ? toRow(record.portfolio) : null,
        },
      });
    },
  );
}
