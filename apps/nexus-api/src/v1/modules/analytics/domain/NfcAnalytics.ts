import { NfcScan } from "./NfcScan";



export type NfcAnalytics = {
  date: string;
  totalScans: number;

  latestScans: {
    scans: NfcScan[];
    pageNumber: number;
    pageSize: number;
    totalScans: number;
    totalPages: number;
  };
};
