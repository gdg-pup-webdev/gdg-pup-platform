import { AnalyticsController } from "./AnalyticsController";
import { SupabaseNfcScanRepository } from "./infrastructure/SupabaseNfcScanRepository";
import { SupabaseProfileViewRepository } from "./infrastructure/SupabaseProfileViewRepository";
import { GetNfcAnalytics } from "./useCases/GetNfcAnalytics";
import { GetProfileAnalytics } from "./useCases/GetProfileAnalytics";
import { NfcCardScanned } from "./useCases/NfcCardScanned";
import { ProfileVisited } from "./useCases/ProfileVisited";

const nfcScanRepo = new SupabaseNfcScanRepository();
const profileViewRepo = new SupabaseProfileViewRepository();

const getNfcAnalytics = new GetNfcAnalytics(nfcScanRepo);
const getProfileAnalytics = new GetProfileAnalytics(profileViewRepo);
const nfcCardScanned = new NfcCardScanned(nfcScanRepo);
const profileVisited = new ProfileVisited(profileViewRepo);

export const analyticsController = new AnalyticsController(
  getNfcAnalytics,
  getProfileAnalytics,
  nfcCardScanned,
  profileVisited,
);
