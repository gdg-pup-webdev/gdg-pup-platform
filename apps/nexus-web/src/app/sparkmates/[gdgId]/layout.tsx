import { Metadata } from 'next';
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

type LayoutProps = {
  params: Promise<{ gdgId: string }>;
  children: React.ReactNode;
};

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
      title = `${data.firstName || 'Member'}'s Profile | GDG PUP`;
      description = data.bio || description;
    }
  } catch (error) {}

  return { title, description };
}

export default function SparkmatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
