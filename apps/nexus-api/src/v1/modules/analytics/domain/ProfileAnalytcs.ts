import { ProfileViewer } from "./ProfileViewer";


export type ProfileAnalytcs = {
  date: string;
  totalViews: number;

  latestViews: {
    views: ProfileViewer[];
    pageNumber: number;
    pageSize: number;
    totalViews: number;
    totalPages: number;
  };
};
