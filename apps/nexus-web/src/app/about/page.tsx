import { Metadata } from "next";
import { AboutSection } from "@/features/about";

export const metadata: Metadata = {
  title: "About Us | GDG PUP Nexus",
  description: "Learn more about the Google Developer Group at Polytechnic University of the Philippines.",
  openGraph: { images: ["/og/about.webp"] },
  twitter: { images: ["/og/about.webp"] },
};

export default function AboutPage() {
  return <AboutSection />;
}
