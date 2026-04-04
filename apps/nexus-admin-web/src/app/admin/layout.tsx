"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { INTERNAL_LINKS } from "@/lib/constants/links"; 
import { RequireAuthenticated } from "@/features/authentication/components/RequireAuthenticated";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page gets its own full-screen layout — no topbar/sidebar
  // if (pathname === INTERNAL_LINKS.LOGIN) {
  //   return <AuthGuard>{children}</AuthGuard>;
  // }

  return (
    <>
  <RequireAuthenticated>
       <div className="relative min-h-screen bg-linear-to-b from-gray-50 via-white to-teal-50/30">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(47,183,168,0.08),transparent_45%),radial-gradient(circle_at_20%_20%,rgba(11,31,59,0.06),transparent_35%)]" />
      {/* Topbar — sticky at top */}
      <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body: Sidebar + Main */}
      <div className="flex w-full items-start">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area — fills at least the remaining viewport height */}
        <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 p-5 md:p-7 lg:p-8">
          {children}
        </main>
      </div>

      {/* Footer — full-width bg, visible on scroll */}
      <AdminFooter />
    </div>
  </RequireAuthenticated>
    </>
    // <AuthGuard>
     
    // </AuthGuard>
  );
}

