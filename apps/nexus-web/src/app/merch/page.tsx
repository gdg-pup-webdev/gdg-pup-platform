import { Metadata } from "next";
import { MerchSection } from "@/features/merch";

export const metadata: Metadata = {
  title: "Merch | GDG PUP Nexus",
  description: "Official tech community merchandise store. Get your GDG PUP hoodies, stickers, and more.",
  openGraph: { images: ["/og/merch.webp"] },
  twitter: { images: ["/og/merch.webp"] },
};

export default function MerchPage() {
  return <MerchSection />;
}
