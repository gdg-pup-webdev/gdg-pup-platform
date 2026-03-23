import { PortfolioModuleController } from "@/v1/modules/portfolioModule/PortfolioModuleController";
import { PortfolioProps } from "@/v1/modules/portfolioModule/domain/Portfolio";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

function toRow(props: PortfolioProps) {
  return {
    id: props.id,
    user_id: props.userId,
    created_at: props.createdAt,
    updated_at: props.updatedAt,
    first_name: props.firstName,
    middle_name: props.middleName,
    last_name: props.lastName,
    nickname: props.nickname,
    gdg_id: props.gdgId,
    membership_type: props.membershipType,
    department: props.department,
    year_level: props.yearLevel,
    program: props.program,
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

/**
 * Maps snake_case keys from the API contract to camelCase keys used in the Domain/Application layer.
 */
function toCamelCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const camelKey = key.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", ""),
    );
    result[camelKey] = obj[key];
  }
  return result;
}

export class PortfoliosHttpController {
  constructor(
    private readonly portfolioModuleController: PortfolioModuleController,
  ) {}

  listPortfolios: RequestHandler = createExpressController(
    contract.api.v1.portfolios.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const name = input.query.name;
      const gdgId = input.query.gdg_id;

      // Delegate to a targeted use case when a filter is provided
      if (name) {
        const portfolio =
          await this.portfolioModuleController.getPortfolioByName(name);
        return output(200, {
          status: "success",
          message: "Portfolio fetched by name successfully",
          data: [toRow(portfolio)],
          meta: {
            totalRecords: 1,
            currentPage: 1,
            pageSize: 1,
            totalPages: 1,
          },
        });
      }

      if (gdgId) {
        const portfolio =
          await this.portfolioModuleController.getPortfolioByGdgId(gdgId);
        return output(200, {
          status: "success",
          message: "Portfolio fetched by GDG ID successfully",
          data: [toRow(portfolio)],
          meta: {
            totalRecords: 1,
            currentPage: 1,
            pageSize: 1,
            totalPages: 1,
          },
        });
      }

      const { list, count } =
        await this.portfolioModuleController.listPortfolios(
          pageNumber,
          pageSize,
        );

      return output(200, {
        status: "success",
        message: "Portfolios fetched successfully",
        data: list.map((p) => toRow(p)),
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );

  getPortfolioById: RequestHandler = createExpressController(
    contract.api.v1.portfolios.portfolioId.GET,
    async ({ input, output }) => {
      const portfolio = await this.portfolioModuleController.getPortfolioById(
        input.params.portfolioId,
      );

      return output(200, {
        status: "success",
        message: "Portfolio fetched successfully",
        data: toRow(portfolio),
      });
    },
  );

  updatePortfolioProperty: RequestHandler = createExpressController(
    contract.api.v1.portfolios.portfolioId.PATCH,
    async ({ input, output }) => {
      const profileImageFile = input.files.profile_image;
      const camelUpdates = toCamelCase(input.body.data);

      if (profileImageFile) {
        (camelUpdates as any).profileImage = {
          buffer: await profileImageFile.arrayBuffer(),
          name: profileImageFile.name,
          type: profileImageFile.type,
        };
      }

      const portfolio =
        await this.portfolioModuleController.updatePortfolioProperty(
          input.params.portfolioId,
          camelUpdates as any,
        );

      return output(200, {
        status: "success",
        message: "Portfolio updated successfully",
        data: toRow(portfolio),
      });
    },
  );
}
