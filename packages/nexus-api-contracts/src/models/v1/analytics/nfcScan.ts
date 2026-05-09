import { cz } from "@packages/typed-rest/shared";

export const NfcScanRecord = cz.object({
  id: cz.string().uuid(),
  date: cz.string().datetime(),
  nfcCardId: cz.string(),
  scanContext: cz.string().nullable(),
  scannerId: cz.string().nullable(),
});

export const NfcScanRecordInsertDTO = NfcScanRecord.omit({
  id: true,
  date: true,
  nfcCardId: true,
}).extend({
  ownerGdgId: cz.string(),
});

export const NfcAnalyticsRecord = cz.object({
  date: cz.string().datetime(),
  totalScans: cz.number(),
  dailyStats: cz.array(cz.object({
    date: cz.string(),
    count: cz.number(),
  })),
  latestScans: cz.object({
    scans: cz.array(NfcScanRecord),
    pageNumber: cz.number(),
    pageSize: cz.number(),
    totalScans: cz.number(),
    totalPages: cz.number(),
  }),
});
