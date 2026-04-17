import { Metadata } from 'next';
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

type LayoutProps = {
  params: Promise<{ articleId: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { articleId } = await params;
  let title = "Article | GDG PUP Nexus";
  let description = "Read this article on GDG PUP Nexus";
  let images = ["/og/articles.webp"];

  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.articles.id.GET,
      { params: { id: articleId } }
    );

    if (result.status === 200 && result.body?.data) {
      const data = result.body.data;
      title = `${data.title} | GDG PUP`;
      description = (data.content || "").substring(0, 160) || description;
      if (data.image_url) images = [data.image_url];
    }
  } catch (error) {}

  return { title, description, openGraph: { images }, twitter: { images } };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
