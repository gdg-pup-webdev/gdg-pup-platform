import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@packages/spark-ui/styles.css";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import { Navbar } from "@/components/shared/Navbar";
import { QueryProvider } from "@packages/spark-tools/query";
import { Footer } from "@/components/shared";

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
  console.log("Rendering RootLayout");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <LenisProvider>
            <AuthProvider>
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </LenisProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
