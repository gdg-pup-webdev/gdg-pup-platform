import {
  gdgMembersController,
  GdgMembersController,
} from "@/v1/modules/members";
import {
  nfcCardsModuleController,
  NfcCardsModuleController,
} from "@/v1/modules/nfcCards";
import { rbacController } from "@/v1/modules/rbacSystem";
import { RbacModuleController } from "@/v1/modules/rbacSystem/RbacModuleController";
import { UnauthorizedError } from "@/v1/errors/HttpError";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class GdgMembersHttpController {
  private readonly nfcCardContract = (contract as any).api?.v1?.gdgmembers
    ?.gdgId?.nfc_card;

  constructor(
    private readonly moduleController: GdgMembersController = gdgMembersController,
    private readonly rbaccontroller: RbacModuleController = rbacController,
    private readonly nfccontroller: NfcCardsModuleController = nfcCardsModuleController,
  ) {}

  activateNfcCardByGdgId: RequestHandler = this.nfcCardContract?.activate?.POST
    ? createExpressController(
        this.nfcCardContract.activate.POST,
        async ({ input, output, ctx }) => {
          const usr = ctx.req.decodedToken?.memberInfo.gdgId || null;
          if (!usr) {
            return output(403, {
              status: "fail",
              message: "Unauthorized: No user information found in token",
            });
          }

          if (usr !== input.params.gdgId) {
            return output(403, {
              status: "fail",
              message: "Unauthorized: You can only activate your own NFC card",
            });
          }

          const result = await this.nfccontroller.activateCardByGdgId(
            input.params.gdgId,
            usr,
          );

          return output(200, {
            status: "success",
            message: "NFC card activated successfully",
            data: result,
          });
        },
      )
    : (_req, res) => {
        res.status(501).json({
          status: "fail",
          message: "NFC card contract is not available in this build",
        });
      };

  getNfcCardOfUser: RequestHandler = this.nfcCardContract?.GET
    ? createExpressController(
        this.nfcCardContract.GET,
        async ({ input, output }) => {
          const result = await this.nfccontroller.getCardByGdgId(
            input.params.gdgId,
          );

          return output(200, {
            status: "success",
            message: "NFC card fetched successfully",
            data: result,
          });
        },
      )
    : (_req, res) => {
        res.status(501).json({
          status: "fail",
          message: "NFC card contract is not available in this build",
        });
      };

  listRolesOfUser: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.roles.GET,
    async ({ input, output }) => {
      const result = await this.rbaccontroller.getRolesAndPermissionsOfUser(
        input.params.gdgId,
      );

      const roles = result.map((role) => role.name);

      return output(200, {
        status: "success",
        message: "Roles fetched successfully",
        data: result,
        meta: {
          currentPage: input.query.pageNumber,
          pageSize: input.query.pageSize,
          totalRecords: roles.length,
          totalPages: Math.ceil(roles.length / input.query.pageSize),
        },
      });
    },
  );

  addRoleToUser: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.roles.POST,
    async ({ input, output }) => {
      const result = await this.rbaccontroller.assignRoleToUser(
        input.params.gdgId,
        input.body.data.roleName,
      );

      return output(200, {
        status: "success",
        message: "Role added to user successfully",
        data: true,
      });
    },
  );

  deleteRoleFromUser: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.roles.roleName.DELETE,
    async ({ input, output }) => {
      await this.rbaccontroller.removeRoleFromUser(
        input.params.gdgId,
        input.params.roleName,
      );

      return output(200, {
        status: "success",
        message: "Role removed from user successfully",
      });
    },
  );

  changeProfileImage: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.profile_image.POST,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const file = input.files?.newProfile;
      if (!file) {
        return output(400, {
          status: "fail",
          message: "No file uploaded",
        });
      }

      const result = await this.moduleController.changeProfilePicture(
        actorId,
        input.params.gdgId,
        file,
      );
      return output(200, {
        status: "success",
        message: "Profile picture updated successfully",
        data: result,
      });
    },
  );

  getSuggestedUsers: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.suggested_users.GET,
    async ({ input, output }) => {
      const result = await this.moduleController.getSuggestedUsers(
        input.query.pageNumber,
        input.query.pageSize,
      );

      const suggestedPreview = result.list.map(({ email, ...rest }) => rest);

      return output(200, {
        status: "success",
        message: "Suggested GDG members fetched successfully",
        data: suggestedPreview,
        meta: {
          currentPage: input.query.pageNumber,
          pageSize: input.query.pageSize,
          totalRecords: result.count,
          totalPages: Math.ceil(result.count / input.query.pageSize),
        },
      });
    },
  );

  get: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.GET,
    async ({ input, output }) => {
      const { pageNumber, pageSize, search, program, department } = input.query;
      const result = await this.moduleController.list(pageNumber, pageSize, {
        search,
        program,
        department,
      });

      return output(200, {
        status: "success",
        message: "GDG members fetched successfully",
        data: result.list.map(({ email, ...rest }) => rest),
        meta: {
          currentPage: pageNumber,
          pageSize,
          totalRecords: result.count,
          totalPages: Math.ceil(result.count / pageSize),
        },
      });
    },
  );

  post: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.POST,
    async ({ input, output }) => {
      const result = await this.moduleController.addMember(input.body.data);
      return output(201, {
        status: "success",
        message: "GDG member added successfully",
        data: result,
      });
    },
  );

  getIdGet: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.GET,
    async ({ input, output }) => {
      const result = await this.moduleController.findByGdgId(
        input.params.gdgId,
      );
      if (!result) {
        return output(404, {
          status: "fail",
          message: "GDG member not found",
        });
      }
      
      const { email, ...rest } = result;

      return output(200, {
        status: "success",
        message: "GDG member fetched successfully",
        data: rest,
      });
    },
  );

  getIdPatch: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.PATCH,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const result = await this.moduleController.update(
        actorId,
        input.params.gdgId,
        input.body.data,
      );
      return output(200, {
        status: "success",
        message: "GDG member updated successfully",
        data: result,
      });
    },
  );

  getIdDelete: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.DELETE,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      await this.moduleController.delete(actorId, input.params.gdgId);
      return output(200, {
        status: "success",
        message: "GDG member deleted successfully",
        data: true,
      });
    },
  );

  getIdMakePrivatePost: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.make_private.POST,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      await this.moduleController.makeProfilePrivate(actorId, input.params.gdgId);
      return output(200, {
        status: "success",
        message: "GDG member profile made private",
        data: true,
      });
    },
  );

  getIdMakePublicPost: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.make_public.POST,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      await this.moduleController.makeProfilePublic(actorId, input.params.gdgId);
      return output(200, {
        status: "success",
        message: "GDG member profile made public",
        data: true,
      });
    },
  );
}
