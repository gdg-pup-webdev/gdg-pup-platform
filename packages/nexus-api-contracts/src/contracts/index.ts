import {
  ApiTypes,
  createContract,
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import { z } from "zod";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/index.js";
import { wallet } from "@/models/economySystem/index.js";

export const nexusApiRoutes = createRoute({
  path: "/api",
  routes: createRoutes({
    health: createRoute({
      path: "/health",
      routes: createRoutes({
        get: createEndpoint({
          method: "GET",
          request: {},
          response: {
            200: z.object({
              status: z.string(),
              message: z.string(),
            }),
            500: SchemaFactory.Response.error(),
          },
        }),
      }),
    }),
    users: createRoute({
      path: "/users",
      routes: createRoutes({
        user: createRoute({
          path: "/:id",
          routes: createRoutes({
            get: createEndpoint({
              method: "GET",
              request: {},
              response: {
                200: SchemaFactory.Response.single(
                  Models.memberMetaSystem.user.row
                ),
                500: SchemaFactory.Response.error(),
              },
            }),
            wallet: createRoute({
              path: "/wallet",
              routes: createRoutes({
                get: createEndpoint({
                  method: "GET",
                  request: {},
                  response: {
                    200: SchemaFactory.Response.single(
                      Models.economySystem.wallet.row
                    ),
                    500: SchemaFactory.Response.error(),
                  },
                }),
                transactions: createRoute({
                  path: "/transactions",
                  routes: createRoutes({
                    list: createEndpoint({
                      method: "GET",
                      request: {},
                      response: {
                        200: SchemaFactory.Response.list(
                          Models.economySystem.transaction.row
                        ),
                        500: SchemaFactory.Response.error(),
                      },
                    }),
                  }),
                }),
              }),
            }),
            profile: createRoute({
              path: "/profile",
              routes: createRoutes({
                get: createEndpoint({
                  method: "GET",
                  request: {},
                  response: {
                    200: SchemaFactory.Response.single(
                      Models.memberMetaSystem.profile.row
                    ),
                    500: SchemaFactory.Response.error(),
                  },
                }),
              }),
            }),
            role: createRoute({
              path: "/role",
              routes: createRoutes({
                get: createEndpoint({
                  method: "GET",
                  request: {},
                  response: {
                    200: SchemaFactory.Response.single(
                      Models.memberMetaSystem.role.row
                    ),
                    500: SchemaFactory.Response.error(),
                  },
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
});

export const nexusApiContract = createContract(nexusApiRoutes);
export type NexusApiTypes = ApiTypes<typeof nexusApiRoutes>;
