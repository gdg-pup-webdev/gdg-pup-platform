import { Metadata } from 'next';
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

type LayoutProps = {
  params: Promise<{ gdgId: string }>;
  children: React.ReactNode;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gdgpup.org";

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { gdgId } = await params;
  let title = "Sparkmate | GDG PUP Nexus";
  let description = "Checkout this member's profile on GDG PUP Nexus";

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
    }
  } catch (error) {}

  const ogImageUrl = `${SITE_URL}/sparkmates/${gdgId}/opengraph-image`;

  return { 
    title, 
    description, 
    openGraph: { 
      title, 
      description, 
      images: [ogImageUrl] 
    }, 
    twitter: { 
      card: "summary_large_image",
      images: [ogImageUrl] 
    } 
  };
}

export default function SparkmatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
