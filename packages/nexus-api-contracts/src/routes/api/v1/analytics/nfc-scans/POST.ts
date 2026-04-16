import {
  NfcScanRecord,
  NfcScanRecordInsertDTO,
} from "#models/v1/analytics/nfcScan.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  NfcScanRecordInsertDTO,
);

export const response = {
  201: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Record an NFC card scan";
export const docs_description =
  "Creates a new record for an NFC card scan event.";
