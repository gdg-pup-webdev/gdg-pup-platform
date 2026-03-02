/**
 * @deprecated Do not use. The root app/layout.tsx already wraps all pages with Navbar and Footer.
 * Wrapping pages in this component causes Footer to render twice.
 * Scheduled for removal.
 */
import React from "react";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
