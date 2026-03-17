"use client";
 
import { useRouter } from "next/navigation";
import { useState } from "react";
import { INTERNAL_LINKS } from "@/lib/constants/links";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  // const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // logout();
        router.push(INTERNAL_LINKS.LOGIN);
        router.refresh();
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
    >
      <LogOut size={16} />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
