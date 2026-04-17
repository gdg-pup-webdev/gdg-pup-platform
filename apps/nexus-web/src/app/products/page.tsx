import { Metadata } from "next";
import { ProductsSection } from "@/features/products";

export const metadata: Metadata = {
  title: "Products | GDG PUP Nexus",
  description: "Explore GDG PUP's tech products, departments, and student-built solutions across Cloud, Web, Data, Cybersecurity, IoT, and more.",
  openGraph: { images: ["/og/products.webp"] },
  twitter: { images: ["/og/products.webp"] },
};

export default function ProductsPage() {
  return <ProductsSection />;
}

