import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

// types inferred from contract models
export type Portfolio = z.infer<typeof contract.api.v1.portfolios.GET.response[200]>["data"][number];

export type PortfolioUpdate = z.infer<typeof contract.api.v1.portfolios.portfolioId.PATCH.request.body>["data"];
