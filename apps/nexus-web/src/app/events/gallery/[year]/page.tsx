import { GalleryYearSection } from "@/features/events";

type GalleryYearPageProps = {
  params: Promise<{ year: string }>;
};

export default async function GalleryYearPage({ params }: GalleryYearPageProps) {
  const { year } = await params;

  return <GalleryYearSection yearParam={year} />;
}

