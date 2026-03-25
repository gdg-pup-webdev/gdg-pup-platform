import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@packages/spark-ui/styles.css";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared";
import { ProviderCompose } from "@/providers/ProviderCompose";
import { DebugNavigator } from "@/features/debugging/components/DebugNavigator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GDG PUP Nexus",
  description:
    "Your gateway to the Google Developer Group at Polytechnic University of the Philippines. Connect, learn, and build with fellow developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProviderCompose>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <DebugNavigator/>
        </ProviderCompose>
      </body>
    </html>
  );
}
