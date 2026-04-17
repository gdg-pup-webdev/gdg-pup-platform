import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sparkmates Network | GDG PUP Nexus",
  description: "Browse the GDG PUP Sparkmates network. Connect with fellow developers, designers, and tech enthusiasts in the community.",
  openGraph: { images: ["/og/gdgprofile.webp"] },
  twitter: { images: ["/og/gdgprofile.webp"] },
};

export default function SparkmateshNetworkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
