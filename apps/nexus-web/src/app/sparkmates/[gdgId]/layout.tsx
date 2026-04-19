import { Metadata } from 'next';
import { headers } from "next/headers";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gdgpup.org";

type LayoutProps = {
  params: Promise<{ gdgId: string }>;
  children: React.ReactNode;
};

const getRequestSiteUrl = async () => {
  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = headerStore.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || headerStore.get("host") || "";

  if (!host) {
    return SITE_URL;
  }

  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
};

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { gdgId } = await params;
  const requestSiteUrl = await getRequestSiteUrl();
  let title = "Sparkmate | GDG PUP Nexus";
  let description = "Checkout this member's profile on GDG PUP Nexus";
  const profileUrl = `${requestSiteUrl}/sparkmates/${gdgId}`;
  const ogImageUrl = `${requestSiteUrl}/sparkmates/${gdgId}/opengraph-image`;

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

  return {
    title,
    description,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      url: profileUrl,
      type: "profile",
      siteName: "GDG PUP Nexus",
      locale: "en_US",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} OG Image`,
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

