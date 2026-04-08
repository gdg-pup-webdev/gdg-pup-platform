import { useMutation } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/configs/servers.config";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Hook to record an NFC card scan.
 */
export const useRecordNfcScan = () => {
  return useMutation({
    mutationFn: async (payload: {
      nfcCardId: string;
      scanContext?: string | null;
      scannerId?: string | null;
    }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.analytics.nfc_scans.POST,
        {
          body: {
            data: {
              nfcCardId: payload.nfcCardId,
              scanContext: payload.scanContext ?? null,
              scannerId: payload.scannerId ?? null,
            },
          },
        },
      );

      if (res.status !== 201) {
        throw new Error(extractErrorMessage(res.body));
      }

      return res.body.data;
    },
  });
};

/**
 * Hook to record a profile view.
 */
export const useRecordProfileView = () => {
  return useMutation({
    mutationFn: async (payload: {
      profileGdgId: string;
      viewerGdgId?: string | null;
      user_agent: string;
      source: string;
    }) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.analytics.profile_views.POST,
        {
          body: {
            data: {
              profileGdgId: payload.profileGdgId,
              viewerGdgId: payload.viewerGdgId ?? null,
              user_agent: payload.user_agent,
              source: payload.source,
            },
          },
        },
      );

      if (res.status !== 201) {
        throw new Error(extractErrorMessage(res.body));
      }

      return res.body.data;
    },
  });
};
