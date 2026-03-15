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
    full_name: props.fullName,
    nickname: props.nickname,
    gdg_id: props.gdgId,
    membership_type: props.membershipType,
    department: props.department,
    year_and_program: props.yearAndProgram,
    bio: props.bio,
    github_url: props.githubUrl,
    linkedin_url: props.linkedinUrl,
    portfolio_website_url: props.portfolioWebsiteUrl,
    other_links: props.otherLinks,
    technical_skills: props.technicalSkills,
    learning_interests: props.learningInterests,
    tools_and_technologies: props.toolsAndTechnologies,
    is_public: props.isPublic,
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
          source: record.source,
          status: record.status,
          portfolio: record.portfolio ? toRow(record.portfolio) : null,
        },
      });
    },
  );
}
