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
        data: list.map(toRow),
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
      const portfolio =
        await this.portfolioModuleController.updatePortfolioProperty(
          input.params.portfolioId,
          input.body.data,
        );

      return output(200, {
        status: "success",
        message: "Portfolio updated successfully",
        data: toRow(portfolio),
      });
    },
  );
}
