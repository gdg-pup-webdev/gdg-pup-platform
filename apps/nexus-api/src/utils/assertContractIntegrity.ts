import { contract } from "@packages/nexus-api-contracts";

type ContractCheck = {
  path: string;
  value: unknown;
};

const getRequiredContractChecks = (contractValue: unknown): ContractCheck[] => [
  {
    path: "contract.api.v1.event_highlights.POST",
    value: (contractValue as any)?.api?.v1?.event_highlights?.POST,
  },
  {
    path: "contract.api.v1.event_highlights.GET",
    value: (contractValue as any)?.api?.v1?.event_highlights?.GET,
  },
  {
    path: "contract.api.v1.event_highlights.id.GET",
    value: (contractValue as any)?.api?.v1?.event_highlights?.id?.GET,
  },
];

export const findMissingContractPaths = (contractValue: unknown = contract) =>
  getRequiredContractChecks(contractValue)
    .filter((check) => !check.value)
    .map((check) => check.path);

export const assertContractIntegrity = () => {
  const missingPaths = findMissingContractPaths();

  if (missingPaths.length === 0) {
    return;
  }

  throw new Error(
    [
      "Missing required API contract routes.",
      `Missing keys: ${missingPaths.join(", ")}`,
      "",
      "This usually means @packages/nexus-api-contracts/dist is stale.",
      "Fix:",
      "1) pnpm --filter @packages/nexus-api-contracts build",
      "2) Start backend from workspace root: pnpm dev:backend",
      "   -or from apps/nexus-api: pnpm dev:local",
    ].join("\n"),
  );
};
