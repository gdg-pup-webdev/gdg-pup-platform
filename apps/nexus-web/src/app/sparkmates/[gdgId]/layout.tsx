import { Metadata } from 'next';
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gdgpup.org";

type LayoutProps = {
  params: Promise<{ gdgId: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { gdgId } = await params;
  let title = "Sparkmate | GDG PUP Nexus";
  let description = "Checkout this member's profile on GDG PUP Nexus";
  let imageAlt = "GDG PUP Sparkmate Profile";

  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.gdgmembers.gdgId.GET,
      { params: { gdgId } }
    );

    if (result.status === 200 && result.body?.data) {
      const data = result.body.data;
      const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
      title = `${fullName || data.displayName || 'Member'}'s Profile | GDG PUP`;
      description = data.bio || description;
      imageAlt = `${fullName || 'Sparkmate'}'s GDG PUP Profile`;
    }
  } catch (error) {}

  const pageUrl = `${SITE_URL}/sparkmates/${gdgId}`;
  // Next.js auto-discovers opengraph-image.tsx, but we also set it explicitly
  // so that metadata merging from the root layout doesn't override it with the static OG image.
  const ogImageUrl = `${SITE_URL}/sparkmates/${gdgId}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      url: pageUrl,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function SparkmatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
