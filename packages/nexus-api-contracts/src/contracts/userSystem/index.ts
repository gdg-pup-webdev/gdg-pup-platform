 
import { Models } from "@/models/index.js";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import {
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";

export const userSystemRoutes = createRoutes({
  user: createRoute({
    path: "/:id",
    routes: createRoutes({
      get: createEndpoint({
        method: "GET",
        request: {},
        response: {
          200: SchemaFactory.Response.single(Models.userSystem.user.row),
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
              200: SchemaFactory.Response.single(Models.userSystem.profile.row),
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
              200: SchemaFactory.Response.single(Models.roleSystem.role.row),
              500: SchemaFactory.Response.error(),
            },
          }),
        }),
      }),
    }),
  }),
});
