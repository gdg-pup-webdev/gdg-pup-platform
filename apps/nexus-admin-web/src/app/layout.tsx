import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "@/features/authentication/store/useAuthStore";

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
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

<QueryProvider>
  
        <main>
          <AuthContextProvider>
          {children}</AuthContextProvider>
        </main>
        <ToastContainer position="bottom-right" />
</QueryProvider>
      </body>
    </html>
  );
}
