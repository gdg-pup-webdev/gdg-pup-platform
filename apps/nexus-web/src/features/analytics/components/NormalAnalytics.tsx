import React from "react";
import { AnalyticsConfig, AnalyticsTracker } from "./AnalyticsTracker";

export const NormalAnalytics = () => {
  const configs: AnalyticsConfig[] = [
    {
      path: "/sparkmates/:gdgId",
      trigger: "profile-view",
      params: {
        profileGdgId: "params.gdgId",
        source: "queries.source",
      },
    },
    {
      path: "/nfc-cards/:cardId",
      trigger: "nfc-scan",
      params: {
        nfcCardId: "params.cardId",
        scanContext: "queries.context",
        scannerId: "queries.scannerId",
      },
    },
  ];

  return <AnalyticsTracker configs={configs} />;
};
