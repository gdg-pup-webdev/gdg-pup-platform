import type { Metadata } from "next";
import "@packages/spark-ui/styles.css";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared";
import { ProviderCompose } from "@/providers/ProviderCompose";
import { DebugNavigator } from "@/features/debugging/components/DebugNavigator"; 
import { Analytics } from "@/features/analytics";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "GDG PUP Nexus",
  description:
    "Your gateway to the Google Developer Group at Polytechnic University of the Philippines. Connect, learn, and build with fellow developers.",
  openGraph: {
    type: "website",
    siteName: "GDG PUP Nexus",
    title: "GDG PUP Nexus",
    description: "Your gateway to the Google Developer Group at Polytechnic University of the Philippines. Connect, learn, and build with fellow developers.",
    images: ["/og/gdgprofile.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG PUP Nexus",
    description: "Your gateway to the Google Developer Group at Polytechnic University of the Philippines. Connect, learn, and build with fellow developers.",
    images: ["/og/gdgprofile.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Display:wght@400;500;700&family=Google+Sans+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <ProviderCompose>
          <Analytics/>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <DebugNavigator/>
        </ProviderCompose>
      </body>
    </html>
  );
}
