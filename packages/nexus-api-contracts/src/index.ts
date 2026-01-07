import {
  ApiTypes,
  createContract,
  createEndpoint,
  createRoute,
  createRoutes,
} from "@packages/api-typing";
import z from "zod";
import { SchemaFactory } from "./schemaFactory.utils.js";

export const nexusApiRoutes = createRoute({
  path: "/api",
  routes: createRoutes({
    leaderboardSystem: createRoute({
      path: "/leaderboard-system",
      routes: createRoutes({
        wallets: createRoute({
          path: "/wallets",
          routes: createRoutes({
            list: createEndpoint({
              method: "GET",
              request: {},
              response: {
                200: SchemaFactory.Response.single(
                  z.object({ message: z.string() })
                ),
                500: SchemaFactory.Response.error(),
                400: SchemaFactory.Response.error(),
              },
            }),
          }),
        }),
      }),
    }),
  }),
});
 

export const nexusApiContract = createContract(nexusApiRoutes);
export type NexusApiTypes = ApiTypes<typeof nexusApiRoutes>;
