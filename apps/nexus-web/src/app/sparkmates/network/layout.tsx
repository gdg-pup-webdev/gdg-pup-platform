import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gdgpup.org";
const OG_IMAGE = `${SITE_URL}/og/gdgprofile.webp`;

export const metadata: Metadata = {
  title: "Sparkmates Network | GDG PUP Nexus",
  description: "Browse the GDG PUP Sparkmates network. Connect with fellow developers, designers, and tech enthusiasts in the community.",
  openGraph: { images: [OG_IMAGE] },
  twitter: { images: [OG_IMAGE] },
};

export default function SparkmateshNetworkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
