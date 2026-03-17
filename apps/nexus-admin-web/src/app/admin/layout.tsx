"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { INTERNAL_LINKS } from "@/lib/constants/links";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page gets its own full-screen layout — no topbar/sidebar
  if (pathname === INTERNAL_LINKS.LOGIN) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar — sticky at top */}
      <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body: Sidebar + Main */}
      <div className="mx-auto flex max-w-screen-2xl">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area — fills at least the remaining viewport height */}
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>

      {/* Footer — full-width bg, visible on scroll */}
      <AdminFooter />
    </div>
  );
}

